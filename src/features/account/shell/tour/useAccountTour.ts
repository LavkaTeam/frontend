import { useCallback, useEffect, useRef } from 'react';
import { driver, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

import type { UserResponse } from '@/types/user';
import type { AccountTabKey } from '../model/accountTabs';
import { getAccountTourSteps } from './accountTourSteps';
import './accountTour.css';

const storageKey = (userId: string) => `b2bar:account-tour:v1:${userId}`;

const hasSeenTour = (userId: string) => {
  try {
    return localStorage.getItem(storageKey(userId)) === 'done';
  } catch {
    return true;
  }
};

const markTourSeen = (userId: string) => {
  try {
    localStorage.setItem(storageKey(userId), 'done');
  } catch {
    // Storage may be unavailable (private mode); the tour just shows again.
  }
};

/**
 * Guided tour of the account: runs once for a newly registered user and can
 * be replayed with `startTour`. "New" means NOT_VERIFIED, the status every
 * account gets on registration.
 */
const useAccountTour = (
  user: UserResponse | undefined,
  tabs: AccountTabKey[],
) => {
  const driverRef = useRef<Driver | null>(null);

  const startTour = useCallback(() => {
    if (!user) return;

    driverRef.current?.destroy();

    const tour = driver({
      steps: getAccountTourSteps(user.role, tabs),
      popoverClass: 'b2barTour',
      showProgress: true,
      progressText: '{{current}} of {{total}}',
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'Got it',
      overlayColor: '#0a0d12',
      overlayOpacity: 0.45,
      stagePadding: 6,
      stageRadius: 10,
      smoothScroll: true,
      // Any way of leaving the tour counts as "seen".
      onDestroyed: () => {
        markTourSeen(user.id);
        driverRef.current = null;
      },
    });

    driverRef.current = tour;
    tour.drive();
  }, [tabs, user]);

  const isNewAccount =
    (user?.verificationStatus ?? user?.status) === 'NOT_VERIFIED';

  useEffect(() => {
    if (!user || !isNewAccount || tabs.length === 0 || hasSeenTour(user.id)) {
      return undefined;
    }

    // Lets the sidebar and the active tab finish rendering first.
    const timerId = window.setTimeout(startTour, 600);

    return () => window.clearTimeout(timerId);
  }, [isNewAccount, startTour, tabs.length, user]);

  useEffect(() => () => driverRef.current?.destroy(), []);

  return { startTour };
};

export { useAccountTour };
