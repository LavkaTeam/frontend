import { lazy, Suspense, useEffect } from 'react';
import useTabSelection from '@/hooks/useTabSelection';
import { Loader } from '@/components/ui/Loader';
import style from './TabsList.module.css';

const LazyBuyerProfile = lazy(
  () => import('@/components/Account/Tabs/BuyerProfile/BuyerProfile')
);
const LazyBuyerOrders = lazy(
  () => import('@/components/Account/Tabs/BuyerOrders/BuyerOrders')
);
const LazyBuyerFavorites = lazy(
  () => import('@/components/Account/Tabs/BuyerFavorites/BuyerFavorites')
);
const LazyBuyerViewingHistory = lazy(
  () =>
    import('@/components/Account/Tabs/BuyerViewingHistory/BuyerViewingHistory')
);
const LazyBuyerSubscriptions = lazy(
  () =>
    import('@/components/Account/Tabs/BuyerSubscriptions/BuyerSubscriptions')
);
const LazyBuyerSupport = lazy(
  () => import('@/components/Account/Tabs/BuyerSupport/BuyerSupport')
);
// const LazySellerProfile = lazy(() => import('@/components/Account/Tabs/SellerProfile/SellerProfile'));
// const LazySellerProducts = lazy(() => import('@/components/Account/Tabs/SellerProducts/SellerProducts'));
// const LazySellerOrders = lazy(() => import('@/components/Account/Tabs/SellerOrders/SellerOrders'));
// const LazySellerFinances = lazy(() => import('@/components/Account/Tabs/SellerFinances/SellerFinances'));
// const LazySellerAnalytics = lazy(() => import('@/components/Account/Tabs/SellerAnalytics/SellerAnalytics'));
// const LazySellerMessages = lazy(() => import('@/components/Account/Tabs/SellerMessages/SellerMessages'));
// const LazySellerSupport = lazy(() => import('@/components/Account/Tabs/SellerSupport/SellerSupport'));

const tabComponents: Record<string, React.LazyExoticComponent<any>> = {
  buyerProfile: LazyBuyerProfile,
  buyerOrders: LazyBuyerOrders,
  buyerFavorites: LazyBuyerFavorites,
  buyerViewingHistory: LazyBuyerViewingHistory,
  buyerSubscriptions: LazyBuyerSubscriptions,
  buyerSupport: LazyBuyerSupport,
  // sellerProfile: LazySellerProfile,
  // sellerProducts: LazySellerProducts,
  // sellerOrders: LazySellerOrders,
  // sellerFinances: LazySellerFinances,
  // sellerAnalytics: LazySellerAnalytics,
  // sellerMessages: LazySellerMessages,
  // sellerSupport: LazySellerSupport,
};

interface TabsListProps {
  role: string;
  onTabChange?: (tabKey: string) => void;
}

interface TabsListComponent extends React.FC<TabsListProps> {
  Content: React.FC<{ activeTab?: string }>;
}

const TabsList: TabsListComponent = ({ role, onTabChange }) => {
  const getTabsByRole = (userRole: string) => {
    const normalizedRole = userRole.toLowerCase();

    if (normalizedRole === 'seller') {
      return [
        { tabKey: 'sellerProfile', displayName: 'My Profile' },
        { tabKey: 'sellerProducts', displayName: 'My Products' },
        { tabKey: 'sellerOrders', displayName: 'Orders' },
        { tabKey: 'sellerFinances', displayName: 'Finances' },
        { tabKey: 'sellerAnalytics', displayName: 'Analytics' },
        { tabKey: 'sellerMessages', displayName: 'Messages' },
        { tabKey: 'sellerSupport', displayName: 'Support' },
      ];
    }

    if (normalizedRole === 'buyer') {
      return [
        { tabKey: 'buyerProfile', displayName: 'My Profile' },
        { tabKey: 'buyerOrders', displayName: 'My Orders' },
        { tabKey: 'buyerFavorites', displayName: 'Favorites' },
        { tabKey: 'buyerViewingHistory', displayName: 'Viewing History' },
        {
          tabKey: 'buyerSubscriptions',
          displayName: 'Subscriptions / Newsletters',
        },
        { tabKey: 'buyerSupport', displayName: 'Support' },
      ];
    }
    return [];
  };

  const tabs = getTabsByRole(role);
  const initialTab = tabs[0]?.tabKey || '';
  const { activeTab, handleTabChange } = useTabSelection(
    initialTab,
    tabs.map((tab) => tab.tabKey)
  );

  // Викликаємо onTabChange при зміні активної вкладки
  useEffect(() => {
    if (activeTab && onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const handleTabClick = (tabKey: string) => {
    handleTabChange(tabKey);
  };

  return (
    <div className={style.TabsList}>
      {tabs.map((tab) => (
        <div
          key={tab.tabKey}
          onClick={() => handleTabClick(tab.tabKey)}
          className={`${style.TabItem} ${
            activeTab === tab.tabKey ? style.TabItemActive : ''
          }`}
        >
          {tab.displayName}
        </div>
      ))}
    </div>
  );
};

// Додаємо компонент для відображення контенту
TabsList.Content = ({ activeTab }: { activeTab?: string }) => {
  if (!activeTab) {
    return null;
  }

  const LazyComponent = tabComponents[activeTab];

  if (!LazyComponent) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <LazyComponent />
    </Suspense>
  );
};

export { TabsList };
