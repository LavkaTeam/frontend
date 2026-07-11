import {
  lazy,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';
import type { UserRole } from '@/types/user';

// Buyer Tabs
const LazyBuyerProfile = lazy(
  () => import('@/features/account/buyer/BuyerProfile/BuyerProfile'),
);
const LazyBuyerOrders = lazy(
  () => import('@/features/account/buyer/BuyerOrders/BuyerOrders'),
);
const LazyBuyerFavorites = lazy(
  () => import('@/features/account/buyer/BuyerFavorites/BuyerFavorites'),
);
const LazyBuyerViewingHistory = lazy(
  () =>
    import('@/features/account/buyer/BuyerViewingHistory/BuyerViewingHistory'),
);
const LazyBuyerSubscriptions = lazy(
  () =>
    import('@/features/account/buyer/BuyerSubscriptions/BuyerSubscriptions'),
);
const LazyBuyerMessages = lazy(
  () => import('@/features/account/buyer/BuyerMessages/BuyerMessages'),
);

// Seller Tabs
const LazySellerProfile = lazy(
  () => import('@/features/account/seller/SellerProfile/SellerProfile'),
);
const LazySellerProducts = lazy(
  () =>
    import('@/features/account/seller/SellerProducts/SellerProducts'),
);
const LazySellerOrders = lazy(
  () => import('@/features/account/seller/SellerOrders/SellerOrders'),
);
const LazySellerFinances = lazy(
  () =>
    import('@/features/account/seller/SellerFinances/SellerFinances'),
);
const LazySellerAnalytics = lazy(
  () =>
    import('@/features/account/seller/SellerAnalytics/SellerAnalytics'),
);
const LazySellerMessages = lazy(
  () =>
    import('@/features/account/seller/SellerMessages/SellerMessages'),
);

export type AccountTabKey =
  | 'profile'
  | 'orders'
  | 'favorites'
  | 'viewingHistory'
  | 'subscriptions'
  | 'messages'
  | 'products'
  | 'finances'
  | 'analytics';

export interface AccountTabDefinition {
  tabKey: AccountTabKey;
  displayName: string;
}

type AccountTabComponent = LazyExoticComponent<ComponentType>;

const BUYER_TAB_COMPONENTS: Partial<Record<AccountTabKey, AccountTabComponent>> = {
  profile: LazyBuyerProfile,
  orders: LazyBuyerOrders,
  favorites: LazyBuyerFavorites,
  viewingHistory: LazyBuyerViewingHistory,
  subscriptions: LazyBuyerSubscriptions,
  messages: LazyBuyerMessages,
};

const SELLER_TAB_COMPONENTS: Partial<Record<AccountTabKey, AccountTabComponent>> = {
  profile: LazySellerProfile,
  products: LazySellerProducts,
  orders: LazySellerOrders,
  finances: LazySellerFinances,
  analytics: LazySellerAnalytics,
  messages: LazySellerMessages,
};

const ACCOUNT_TABS_BY_ROLE: Record<
  UserRole,
  Partial<Record<AccountTabKey, AccountTabComponent>>
> = {
  BUYER: BUYER_TAB_COMPONENTS,
  SELLER: SELLER_TAB_COMPONENTS,
  ADMIN: {},
};

const ALL_ACCOUNT_TAB_KEYS = new Set<AccountTabKey>([
  'profile',
  'orders',
  'favorites',
  'viewingHistory',
  'subscriptions',
  'messages',
  'products',
  'finances',
  'analytics',
]);

const LEGACY_TAB_KEY_MAP: Record<string, AccountTabKey> = {
  buyerProfile: 'profile',
  sellerProfile: 'profile',
  buyerOrders: 'orders',
  sellerOrders: 'orders',
  buyerFavorites: 'favorites',
  buyerViewingHistory: 'viewingHistory',
  buyerSubscriptions: 'subscriptions',
  buyerMessages: 'messages',
  sellerMessages: 'messages',
  sellerProducts: 'products',
  sellerFinances: 'finances',
  sellerAnalytics: 'analytics',
};

export const normalizeAccountTabKey = (
  rawTabKey?: string | null,
): AccountTabKey | null => {
  if (!rawTabKey) return null;
  if (LEGACY_TAB_KEY_MAP[rawTabKey]) {
    return LEGACY_TAB_KEY_MAP[rawTabKey];
  }

  return ALL_ACCOUNT_TAB_KEYS.has(rawTabKey as AccountTabKey)
    ? (rawTabKey as AccountTabKey)
    : null;
};

export const getAccountTabComponent = (
  role: UserRole,
  tabKey: AccountTabKey,
) => ACCOUNT_TABS_BY_ROLE[role]?.[tabKey];

export const ROLE_TABS: Record<UserRole, AccountTabDefinition[]> = {
  BUYER: [
    { tabKey: 'profile', displayName: 'My Profile' },
    { tabKey: 'orders', displayName: 'My Orders' },
    { tabKey: 'favorites', displayName: 'Favorites' },
    { tabKey: 'viewingHistory', displayName: 'Viewing History' },
    {
      tabKey: 'subscriptions',
      displayName: 'Subscriptions',
    },
    { tabKey: 'messages', displayName: 'Messages' },
  ],
  SELLER: [
    { tabKey: 'profile', displayName: 'My Profile' },
    { tabKey: 'products', displayName: 'My Products' },
    { tabKey: 'orders', displayName: 'Orders' },
    { tabKey: 'finances', displayName: 'Finances' },
    { tabKey: 'analytics', displayName: 'Analytics' },
    { tabKey: 'messages', displayName: 'Messages' },
  ],
  ADMIN: [],
};
