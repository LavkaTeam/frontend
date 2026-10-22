import { useSyncExternalStore } from 'react';
import {
  AUTH_CHANGE_EVENT,
  getAccessToken,
  getAuthRole,
} from '@/shared/api/client';

const subscribeToAuth = (listener: () => void) => {
  window.addEventListener(AUTH_CHANGE_EVENT, listener);
  // Keeps tabs in sync when the user logs in or out in another tab.
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
};

const getAuthSnapshot = () => Boolean(getAccessToken());
const getAdminSnapshot = () =>
  Boolean(getAccessToken()) && getAuthRole() === 'ADMIN';

const useIsAuthenticated = () =>
  useSyncExternalStore(subscribeToAuth, getAuthSnapshot);

const useIsAdmin = () => useSyncExternalStore(subscribeToAuth, getAdminSnapshot);

/**
 * A signed-in buyer or seller. The admin has no cart, favorites or cabinet:
 * the backend answers 403 there, so those features treat the admin as a
 * guest and never call those endpoints.
 */
const useIsShopper = () => {
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();

  return isAuthenticated && !isAdmin;
};

export { useIsAuthenticated, useIsAdmin, useIsShopper };
