import { useSyncExternalStore } from 'react';
import { AUTH_CHANGE_EVENT, getAccessToken } from '@/shared/api/client';

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

const useIsAuthenticated = () =>
  useSyncExternalStore(subscribeToAuth, getAuthSnapshot);

export { useIsAuthenticated };
