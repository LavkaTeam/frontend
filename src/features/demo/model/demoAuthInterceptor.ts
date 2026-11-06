import {
  getAccessToken,
  setUnauthorizedInterceptor,
  type UnauthorizedContext,
  type UnauthorizedDecision,
} from '@/shared/api/client';

import { dispatchDemoExpired } from './demoEvents';
import { isDemoTransition } from './demoTransition';

/**
 * Decides what a 401 means in the demo:
 * - during our own switch/reset/exit, or for a request sent with a token that
 *   is no longer the current one: the old sandbox died on purpose, ignore;
 * - DEMO_SESSION_EXPIRED: the sandbox is over. Refreshing would return the
 *   same code, so announce it and skip the refresh;
 * - anything else (invalid token): the normal flow.
 */
export const judgeDemoUnauthorized = ({
  code,
  sentToken,
}: UnauthorizedContext): UnauthorizedDecision => {
  const isStaleToken = sentToken !== null && sentToken !== getAccessToken();

  if (isDemoTransition() || isStaleToken) return 'handled';

  if (code === 'DEMO_SESSION_EXPIRED') {
    dispatchDemoExpired();
    return 'handled';
  }

  return 'default';
};

export const installDemoAuthInterceptor = () => {
  setUnauthorizedInterceptor(judgeDemoUnauthorized);
};
