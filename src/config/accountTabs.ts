import { lazy } from 'react';

// Buyer Tabs
const LazyBuyerProfile = lazy(
  () => import('@/components/Account/Tabs/Buyer/BuyerProfile/BuyerProfile'),
);
const LazyBuyerOrders = lazy(
  () => import('@/components/Account/Tabs/Buyer/BuyerOrders/BuyerOrders'),
);
const LazyBuyerFavorites = lazy(
  () => import('@/components/Account/Tabs/Buyer/BuyerFavorites/BuyerFavorites'),
);
const LazyBuyerViewingHistory = lazy(
  () =>
    import('@/components/Account/Tabs/Buyer/BuyerViewingHistory/BuyerViewingHistory'),
);
const LazyBuyerSubscriptions = lazy(
  () =>
    import('@/components/Account/Tabs/Buyer/BuyerSubscriptions/BuyerSubscriptions'),
);
const LazyBuyerSupport = lazy(
  () => import('@/components/Account/Tabs/Buyer/BuyerSupport/BuyerSupport'),
);

// Seller Tabs
const LazySellerProfile = lazy(
  () => import('@/components/Account/Tabs/Seller/SellerProfile/SellerProfile'),
);
const LazySellerProducts = lazy(
  () =>
    import('@/components/Account/Tabs/Seller/SellerProducts/SellerProducts'),
);
const LazySellerOrders = lazy(
  () => import('@/components/Account/Tabs/Seller/SellerOrders/SellerOrders'),
);
const LazySellerFinances = lazy(
  () =>
    import('@/components/Account/Tabs/Seller/SellerFinances/SellerFinances'),
);
const LazySellerAnalytics = lazy(
  () =>
    import('@/components/Account/Tabs/Seller/SellerAnalytics/SellerAnalytics'),
);
const LazySellerMessages = lazy(
  () =>
    import('@/components/Account/Tabs/Seller/SellerMessages/SellerMessages'),
);
const LazySellerSupport = lazy(
  () => import('@/components/Account/Tabs/Seller/SellerSupport/SellerSupport'),
);

export const tabComponents: Record<string, React.LazyExoticComponent<any>> = {
  // Buyer
  buyerProfile: LazyBuyerProfile,
  buyerOrders: LazyBuyerOrders,
  buyerFavorites: LazyBuyerFavorites,
  buyerViewingHistory: LazyBuyerViewingHistory,
  buyerSubscriptions: LazyBuyerSubscriptions,
  buyerSupport: LazyBuyerSupport,

  // Seller
  sellerProfile: LazySellerProfile,
  sellerProducts: LazySellerProducts,
  sellerOrders: LazySellerOrders,
  sellerFinances: LazySellerFinances,
  sellerAnalytics: LazySellerAnalytics,
  sellerMessages: LazySellerMessages,
  sellerSupport: LazySellerSupport,
};

export const ROLE_TABS: Record<
  string,
  Array<{ tabKey: string; displayName: string }>
> = {
  BUYER: [
    { tabKey: 'buyerProfile', displayName: 'My Profile' },
    { tabKey: 'buyerOrders', displayName: 'My Orders' },
    { tabKey: 'buyerFavorites', displayName: 'Favorites' },
    { tabKey: 'buyerViewingHistory', displayName: 'Viewing History' },
    {
      tabKey: 'buyerSubscriptions',
      displayName: 'Subscriptions / Newsletters',
    },
    { tabKey: 'buyerSupport', displayName: 'Support' },
  ],
  SELLER: [
    { tabKey: 'sellerProfile', displayName: 'My Profile' },
    { tabKey: 'sellerProducts', displayName: 'My Products' },
    { tabKey: 'sellerOrders', displayName: 'Orders' },
    { tabKey: 'sellerFinances', displayName: 'Finances' },
    { tabKey: 'sellerAnalytics', displayName: 'Analytics' },
    { tabKey: 'sellerMessages', displayName: 'Messages' },
    { tabKey: 'sellerSupport', displayName: 'Support' },
  ],
};
