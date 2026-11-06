import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useCountdown } from '@/hooks/useCountdown';
import { useToast } from '@/hooks/useToast';
import { clearAuthTokens } from '@/shared/api/client';
import { useAppDispatch } from '@/store/hooks';
import { extractErrorMessage, getRetryAfterSeconds } from '@/utils/error';

import { createDemoSession, endDemo, resetDemo, switchDemoRole } from '../api';
import { clearDemoClientState } from '../model/demoClientState';
import { demoCopy } from '../model/demoCopy';
import { getCapacityRetrySeconds } from '../model/demoErrors';
import { clearDemoExpiry } from '../model/demoExpiryStorage';
import { setDemoExpired } from '../model/demoExpiryStore';
import { runDemoTransition } from '../model/demoTransition';
import { finishDemoSession } from '../model/finishDemoSession';
import type { DemoRole } from '../types';

export const DEMO_HOME_ROUTE = '/account?tab=orders';
const SLOW_AFTER_MS = 8000;

// True once `active` has lasted longer than `afterMs`: a cold demo server
// takes up to a minute to answer the first request.
const useSlowFlag = (active: boolean, afterMs: number) => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!active) {
      setIsSlow(false);
      return undefined;
    }

    const timerId = window.setTimeout(() => setIsSlow(true), afterMs);

    return () => window.clearTimeout(timerId);
  }, [active, afterMs]);

  return isSlow;
};

/**
 * Create, switch, reset and exit of a demo session. None of the calls is ever
 * repeated by itself: create and reset share a per-IP limit on the server, so
 * a double click or an automatic retry would burn it.
 */
export const useDemoSession = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const cooldown = useCountdown();
  const [isExiting, setIsExiting] = useState(false);
  // A double click fires two clicks before React renders the busy state, so
  // the guard cannot be state: this one flips at once and is released when the
  // request settles.
  const lockRef = useRef(false);
  const release = () => {
    lockRef.current = false;
  };

  const handleError = (error: unknown) => {
    // 429 (per-IP limit) and 503 (busy / starting) both say how long to wait.
    const seconds =
      getRetryAfterSeconds(error) || getCapacityRetrySeconds(error);
    if (seconds > 0) cooldown.start(seconds);

    showToast(extractErrorMessage(error, demoCopy.errors.generic), 'error');
  };

  // Every move between sandboxes runs as a transition: requests in flight with
  // the old tokens get 401, which must not look like "the demo has ended".
  const transition = <T>(work: () => Promise<T>) =>
    runDemoTransition(async () => {
      await queryClient.cancelQueries();

      return work();
    });

  const createMutation = useMutation({
    retry: false,
    mutationFn: ({ role }: { role: DemoRole; from?: string }) =>
      transition(async () => {
        const response = await createDemoSession(role);
        await finishDemoSession(response, {
          queryClient,
          dispatch,
          mode: 'create',
        });

        return response;
      }),
    onSuccess: (_response, { from }) => navigate(from || DEMO_HOME_ROUTE),
    onError: handleError,
    onSettled: release,
  });

  const switchMutation = useMutation({
    retry: false,
    mutationFn: () =>
      transition(async () => {
        const response = await switchDemoRole();
        await finishDemoSession(response, {
          queryClient,
          dispatch,
          mode: 'switch',
        });

        return response;
      }),
    onSuccess: () => navigate(DEMO_HOME_ROUTE),
    onError: handleError,
    onSettled: release,
  });

  const resetMutation = useMutation({
    retry: false,
    mutationFn: ({ role }: { role: DemoRole }) =>
      transition(async () => {
        const response = await resetDemo(role);
        await finishDemoSession(response, {
          queryClient,
          dispatch,
          mode: 'reset',
        });

        return response;
      }),
    onSuccess: () => {
      showToast(demoCopy.reset.done, 'success');
      navigate(DEMO_HOME_ROUTE);
    },
    onError: handleError,
    onSettled: release,
  });

  // The server ends the sandbox first (it needs the token, so this comes
  // before the tokens are dropped); a failure is ignored, the visitor leaves
  // either way. localStorage is not cleared: the tour flags live there.
  const exit = async () => {
    setIsExiting(true);

    try {
      await transition(async () => {
        await endDemo().catch(() => undefined);
        clearAuthTokens();
        clearDemoExpiry();
        setDemoExpired(false);
        clearDemoClientState(dispatch, queryClient);
      });
      navigate('/demo');
    } finally {
      setIsExiting(false);
      release();
    }
  };

  const isCreating = createMutation.isPending;
  const isSwitching = switchMutation.isPending;
  const isResetting = resetMutation.isPending;
  const isBusy = isCreating || isSwitching || isResetting || isExiting;

  return {
    createSession: (role: DemoRole, from?: string) => {
      if (lockRef.current || isBusy || cooldown.secondsLeft > 0) return;
      lockRef.current = true;
      createMutation.mutate({ role, from });
    },
    switchRole: () => {
      if (lockRef.current || isBusy) return;
      lockRef.current = true;
      switchMutation.mutate();
    },
    reset: (role: DemoRole) => {
      if (lockRef.current || isBusy || cooldown.secondsLeft > 0) return;
      lockRef.current = true;
      resetMutation.mutate({ role });
    },
    exit: () => {
      if (lockRef.current || isBusy) return;
      lockRef.current = true;
      void exit();
    },
    creatingRole: isCreating ? createMutation.variables?.role : undefined,
    isCreating,
    isSwitching,
    isResetting,
    isExiting,
    isBusy,
    isSlow: useSlowFlag(isCreating || isResetting, SLOW_AFTER_MS),
    cooldownSeconds: cooldown.secondsLeft,
    // Last failure of create/switch/reset, for an inline message.
    error: createMutation.error ?? resetMutation.error ?? switchMutation.error,
  };
};
