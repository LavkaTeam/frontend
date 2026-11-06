import type { QueryClient } from '@tanstack/react-query';

import { syncLocalUserData } from '@/hooks/syncLocalUserData';
import { saveAuthTokens } from '@/shared/api/client';

import type { AppDispatch } from '@/store';

import type { DemoSessionResponse } from '../types';
import { clearDemoClientState } from './demoClientState';
import { saveDemoExpiry } from './demoExpiryStorage';
import { setDemoExpired } from './demoExpiryStore';

export type DemoSessionMode = 'create' | 'switch' | 'reset';

interface FinishDemoSessionContext {
  queryClient: QueryClient;
  dispatch: AppDispatch;
  mode: DemoSessionMode;
}

/**
 * Signs the visitor into the sandbox of a session response. The order matters:
 * the new tokens are saved before anything is refetched, then the caches of the
 * previous user are dropped and the user is loaded again.
 *
 * The first session of an anonymous visitor keeps the guest cart (it is merged
 * as after a login); switch and reset start from empty state, so nothing of
 * the previous sandbox leaks into the new one. Never touches localStorage as a
 * whole: the tour and hint flags live there.
 */
export const finishDemoSession = async (
  response: DemoSessionResponse,
  { queryClient, dispatch, mode }: FinishDemoSessionContext,
) => {
  saveAuthTokens(response);
  saveDemoExpiry(response.demo.expiresAt);
  setDemoExpired(false);

  if (mode !== 'create') {
    clearDemoClientState(dispatch, queryClient);
  } else {
    queryClient.clear();
  }

  await queryClient.invalidateQueries({ queryKey: ['user'] });

  if (mode === 'create') {
    await syncLocalUserData(queryClient);
  }
};
