import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/hooks/useToast';
import { clearAuthTokens } from '@/shared/api/client';
import { useAppDispatch } from '@/store/hooks';

import { useDemoStatus } from '../../hooks/useDemoStatus';
import { clearDemoClientState } from '../../model/demoClientState';
import { demoCopy } from '../../model/demoCopy';
import {
  DEMO_EXPIRED_EVENT,
  dispatchDemoExpired,
} from '../../model/demoEvents';
import {
  clearDemoExpiry,
  markWarnedFor,
  wasWarnedFor,
} from '../../model/demoExpiryStorage';
import { getDemoExpired, setDemoExpired } from '../../model/demoExpiryStore';
import { WARNING_TIME_MS } from '../../model/formatTimeLeft';
import { DemoExpiredModal } from '../DemoExpiredModal/DemoExpiredModal';

// Invisible part of the demo, mounted once in the layout: it ends the session
// when the sandbox is gone and warns shortly before. The ordinary "session
// expired, log in again" flow is not used in the demo.
const DemoRuntime = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isDemoUser, expiresAt, msLeft } = useDemoStatus();

  // The API (401 DEMO_SESSION_EXPIRED) and the timer below both end here.
  useEffect(() => {
    const handleExpired = () => {
      if (getDemoExpired()) return;

      // Tokens go first, so the header is not left "signed in" behind the dialog.
      clearAuthTokens();
      clearDemoExpiry();
      clearDemoClientState(dispatch, queryClient);
      setDemoExpired(true);
    };

    window.addEventListener(DEMO_EXPIRED_EVENT, handleExpired);

    return () => window.removeEventListener(DEMO_EXPIRED_EVENT, handleExpired);
  }, [dispatch, queryClient]);

  // The clock of the sandbox, checked once a minute (msLeft updates then).
  useEffect(() => {
    if (!isDemoUser || msLeft === null) return;

    if (msLeft <= 0) {
      dispatchDemoExpired();
      return;
    }

    if (msLeft <= WARNING_TIME_MS && expiresAt && !wasWarnedFor(expiresAt)) {
      markWarnedFor(expiresAt);
      showToast(demoCopy.warning.fiveMinutes, 'error');
    }
    // showToast only touches module state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt, isDemoUser, msLeft]);

  return <DemoExpiredModal />;
};

export default DemoRuntime;
