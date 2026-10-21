import type { DriveStep } from 'driver.js';

import type { UserRole } from '@/types/user';
import type { AccountTabKey } from '../model/accountTabs';

// Steps point at elements by their data-tour attribute (see AccountShell,
// TabsList and the profile VerificationGuide).
export const tourTarget = (id: string) => `[data-tour="${id}"]`;

const TAB_STEPS: Record<
  Exclude<UserRole, 'ADMIN'>,
  Partial<Record<AccountTabKey, { title: string; description: string }>>
> = {
  SELLER: {
    profile: {
      title: 'My Profile',
      description:
        'Your company, payment and license details. Fill them in and save: our team verifies your company before you can start selling.',
    },
    products: {
      title: 'My Products',
      description:
        'Add products, set prices and stock, and follow their moderation status. Available after verification.',
    },
    orders: {
      title: 'Orders',
      description:
        'Orders from buyers arrive here. Confirm them, prepare the documents and mark them as completed.',
    },
    finances: {
      title: 'Finances',
      description:
        'Your balance, payouts, platform fees and the full transaction history. Request a payout in one click.',
    },
    analytics: {
      title: 'Analytics',
      description:
        'Revenue by month, top categories and order statistics to see how your store is doing.',
    },
    messages: {
      title: 'Messages',
      description: 'Conversations with buyers about products and orders.',
    },
  },
  BUYER: {
    profile: {
      title: 'My Profile',
      description:
        'Your personal and company details and delivery addresses. Complete them to get verified and order faster.',
    },
    orders: {
      title: 'My Orders',
      description:
        'Track every order: its status, delivery and documents such as invoices.',
    },
    favorites: {
      title: 'Favorites',
      description: 'Products you saved with the heart icon, in one place.',
    },
    viewingHistory: {
      title: 'Viewing History',
      description: 'Products you looked at recently, so you can come back to them.',
    },
    subscriptions: {
      title: 'Subscriptions',
      description: 'Choose which news and offers you want to receive.',
    },
    messages: {
      title: 'Messages',
      description: 'Conversations with sellers about products and orders.',
    },
  },
};

export const getAccountTourSteps = (
  role: UserRole,
  tabs: AccountTabKey[],
): DriveStep[] => {
  if (role === 'ADMIN') return [];

  const isSeller = role === 'SELLER';
  const tabSteps = TAB_STEPS[role];

  const steps: DriveStep[] = [
    {
      popover: {
        title: isSeller
          ? 'Welcome to your seller account'
          : 'Welcome to your B2bar account',
        description: isSeller
          ? 'A quick tour of where to manage your store, orders and payouts. It takes less than a minute.'
          : 'A quick tour of where to find your orders, favorites and settings. It takes less than a minute.',
      },
    },
    {
      element: tourTarget('account-identity'),
      popover: {
        title: 'Your company',
        description:
          'Your company name and logo as other users see them. Click the logo to upload your own.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: tourTarget('verification-status'),
      popover: {
        title: 'Verification status',
        description:
          'Shows whether your company is verified. Hover it to see the details, click it to jump to the missing profile fields.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: tourTarget('verification-guide'),
      popover: {
        title: 'What to do next',
        description:
          'This checklist shows which required details are still missing. Click a field name to jump straight to it.',
        side: 'bottom',
        align: 'start',
      },
    },
    ...tabs.flatMap((tabKey): DriveStep[] => {
      const content = tabSteps[tabKey];
      if (!content) return [];

      return [
        {
          element: tourTarget(`tab-${tabKey}`),
          popover: { ...content, side: 'right', align: 'center' },
        },
      ];
    }),
    {
      element: tourTarget('account-tour-button'),
      popover: {
        title: 'You are all set',
        description:
          'You can replay this tour at any time with this button.',
        side: 'bottom',
        align: 'end',
      },
    },
  ];

  // Skip steps whose element is not on the page (e.g. the verification
  // checklist is hidden once the company is verified).
  return steps.filter(
    (step) =>
      !step.element ||
      (typeof step.element === 'string' &&
        document.querySelector(step.element) !== null),
  );
};
