// Every visible demo text in one place. Tone: short and honest. The mode is
// called the "demo environment" or "sandbox", the card payment of the existing
// feature "demo payment", so the two are not mixed up.
import type { DemoRole } from '../types';

export const roleLabel: Record<DemoRole, string> = {
  BUYER: 'Buyer',
  SELLER: 'Seller',
};

export const demoCopy = {
  banner: {
    title: 'DEMO ENVIRONMENT',
    notice: 'Fictional data · No real orders, payments or emails',
    exploringAs: (role: DemoRole) => `You are exploring as ${roleLabel[role]}`,
    deletedIn: (time: string) => `Sandbox deleted in ${time}`,
    compact: (time: string) => `DEMO · ${time}`,
    menu: 'Menu',
    tryDemo: 'Try the demo',
    thingsToTry: 'Things to try',
  },
  menu: {
    switchTo: (role: DemoRole) => `Switch to ${roleLabel[role]} view`,
    reset: 'Reset my demo',
    exit: 'Exit demo',
    currentView: (role: DemoRole) => `Current view: ${roleLabel[role]}`,
  },
  reset: {
    title: 'Reset your demo?',
    message:
      'All changes you made will be lost and a fresh sandbox will be created.',
    confirm: 'Reset my demo',
    done: 'Demo data reset',
  },
  landing: {
    title: 'Explore B2bar with a ready-made demo account',
    subtitle:
      'B2bar is a B2B marketplace where bars, restaurants and wholesale buyers order from several suppliers, and suppliers manage products, orders, documents and finances.',
    honesty:
      'This is a portfolio demo. Companies, products and people are fictional. No real orders, payments or emails are made.',
    sandboxNote: (hours: number) =>
      `Your sandbox is private to you, resets on demand and is deleted after ${hours} hours.`,
    backToCatalog: 'Back to catalog',
    continue: 'Continue to my account',
    startFresh: 'Start fresh',
    loginNote:
      'Accounts are created automatically in the demo. No password needed.',
  },
  roles: {
    BUYER: {
      title: 'Buyer',
      tagline: 'A bar or restaurant ordering from several suppliers',
      sees: [
        'Catalog and search',
        'Cart and checkout across suppliers',
        'Orders and documents',
      ],
    },
    SELLER: {
      title: 'Seller',
      tagline: 'A supplier managing products and orders',
      sees: [
        'Products and wholesale prices',
        'Orders from new to delivered',
        'Documents, finances and analytics',
      ],
    },
  },
  homeCta: {
    title: 'Try B2bar as a Buyer or a Seller',
    text: 'No registration: pick a role and get a ready-made account in one click.',
  },
  cta: {
    explore: (role: DemoRole) => `Explore as ${roleLabel[role]}`,
    preparing: 'Preparing your sandbox…',
    waking: 'Waking up the demo server, this can take up to a minute…',
    retryIn: (seconds: number) => `Try again in ${seconds}s`,
    retry: 'Try again',
  },
  expired: {
    title: 'Your demo has ended',
    text: (hours: number) =>
      `Sandboxes are deleted after ${hours} hours. Start a new one in one click.`,
    backToCatalog: 'Back to catalog',
  },
  warning: {
    fiveMinutes: 'Your demo sandbox ends in 5 minutes.',
  },
  hints: {
    password: 'Password changes are disabled in the demo.',
    uploads: (megabytes: number) =>
      `Demo uploads are limited to ${megabytes} MB per file.`,
    admin: 'The admin panel is not part of the demo.',
  },
  footer: {
    note: 'Portfolio demo. Not a real marketplace.',
    site: 'Visit the main site',
  },
  errors: {
    readOnly: 'This action is disabled in the demo.',
    expired: 'Your demo has ended. Start a new one to keep exploring.',
    busy: 'The demo is busy right now. Please try again in a few minutes.',
    starting: 'The demo is starting up. Please try again in a moment.',
    generic: 'We could not start the demo. Please try again.',
    limit: (limit: string, max: number) =>
      limit === 'upload size in bytes'
        ? `Demo limit reached: upload size (max ${formatMegabytes(max)} MB).`
        : `Demo limit reached: ${limit} (max ${max}).`,
  },
  guide: {
    title: 'Things to try',
    close: 'Close',
    SELLER: [
      'Open Orders, accept a new order and ship it with a tracking number. Orders from shared buyers move on by themselves every few minutes: reload the list to see it.',
      'Generate an Invoice and a Delivery Note and download the PDFs (the first download renders the file and can take a few seconds).',
      'Finances: balance and transactions, then request a payout. It is approved automatically in about a minute; reload to see it.',
      'Analytics: the revenue chart for the year.',
      'My Products: edit a product or create one with wholesale prices. It goes to review and is approved automatically in about 10 seconds; reload the list.',
      'Switch to the Buyer view from the demo menu.',
    ],
    BUYER: [
      'Add products from two suppliers to your cart.',
      'Check out with different payment methods.',
      'Pay for the unpaid order batch with the demo payment.',
      'My Orders: statuses and documents, and the XLSX export. Orders to shared suppliers move through the statuses on their own in about 10 minutes.',
      'To see an order from the seller side, order from your own paired supplier (named below), then switch to the Seller view. Orders to shared suppliers are not visible to the seller of your sandbox.',
    ],
    paired: (name: string) => `Your paired supplier: ${name}`,
  },
} as const;

function formatMegabytes(bytes: number) {
  return Math.round((bytes / 1_048_576) * 10) / 10;
}

export const bytesToMegabytes = formatMegabytes;
