import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Loader } from '@/components/ui/Loader';
import { useAdminStats } from '@/hooks/useAdmin';
import { useUser } from '@/hooks/useUser';
import { AccountLayout } from '@/features/account/shell/ui/AccountLayout/AccountLayout';
import type { TabItem } from '@/features/account/shell/ui/tabs/TabsList';

import styles from './AdminLayout.module.css';

interface AdminTab extends TabItem {
  to: string;
  isActive: (pathname: string, search: URLSearchParams) => boolean;
}

const isReviewQueue = (pathname: string, search: URLSearchParams) =>
  pathname === '/admin/users' && search.get('status') === 'PENDING';

// The admin panel is a cabinet like the buyer and seller ones: same frame,
// its own sections.
const AdminLayout = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { data: stats } = useAdminStats();
  const queues = stats?.queues;

  const tabs: AdminTab[] = [
    {
      tabKey: 'dashboard',
      displayName: 'Dashboard',
      to: '/admin',
      isActive: (path) => path === '/admin',
    },
    {
      tabKey: 'reviews',
      displayName: 'Company review',
      badge: queues?.pendingVerifications,
      to: '/admin/users?status=PENDING',
      isActive: isReviewQueue,
    },
    {
      tabKey: 'users',
      displayName: 'Users',
      to: '/admin/users',
      isActive: (path, params) =>
        path.startsWith('/admin/users') && !isReviewQueue(path, params),
    },
    {
      tabKey: 'payouts',
      displayName: 'Payouts',
      badge: queues?.pendingPayouts,
      to: '/admin/payouts',
      isActive: (path) => path.startsWith('/admin/payouts'),
    },
    {
      tabKey: 'orders',
      displayName: 'Orders',
      to: '/admin/orders',
      isActive: (path) => path.startsWith('/admin/orders'),
    },
    {
      tabKey: 'products',
      displayName: 'Products',
      to: '/admin/products',
      isActive: (path) => path.startsWith('/admin/products'),
    },
    {
      tabKey: 'audit',
      displayName: 'Audit log',
      to: '/admin/audit',
      isActive: (path) => path.startsWith('/admin/audit'),
    },
  ];

  const searchParams = new URLSearchParams(search);
  const activeTab =
    tabs.find((tab) => tab.isActive(pathname, searchParams))?.tabKey ?? '';

  return (
    <div className='container'>
      <AccountLayout
        avatarSrc='/icons/testAvatar.png'
        title='Administrator'
        subtitle={user?.email || ' '}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabKey) => {
          const tab = tabs.find((item) => item.tabKey === tabKey);
          if (tab) navigate(tab.to);
        }}
      >
        <main className={styles.content}>
          <Suspense fallback={<Loader variant='section' />}>
            <Outlet />
          </Suspense>
        </main>
      </AccountLayout>
    </div>
  );
};

export default AdminLayout;
