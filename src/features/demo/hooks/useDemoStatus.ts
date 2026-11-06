import { useEffect, useState } from 'react';

import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { useUser } from '@/hooks/useUser';

import { readDemoExpiry } from '../model/demoExpiryStorage';
import type { DemoRole } from '../types';

const MINUTE_MS = 60_000;

// Whether the signed-in user is a demo visitor (the server marks it), with
// the sandbox expiry and the time left, refreshed once a minute.
export const useDemoStatus = () => {
  const isAuthenticated = useIsAuthenticated();
  const { data: user } = useUser();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), MINUTE_MS);

    return () => window.clearInterval(timerId);
  }, []);

  const isDemoUser = isAuthenticated && Boolean(user?.demo);
  // Until the user loads, the expiry saved with the session is used.
  const expiresAt =
    (user?.demo ? user.demoExpiresAt : null) ||
    (isAuthenticated ? readDemoExpiry() : null);
  const expiresAtMs = expiresAt ? new Date(expiresAt).getTime() : null;

  return {
    isAuthenticated,
    isDemoUser,
    role: user?.demo ? (user.role as DemoRole) : null,
    expiresAt,
    msLeft: expiresAtMs === null ? null : expiresAtMs - now,
  };
};
