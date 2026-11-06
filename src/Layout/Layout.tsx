import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useAuthSessionWatcher } from '@/hooks/useAuthSessionWatcher';

import { isDemoMode } from '@/features/demo/config';

import styles from './Layout.module.css';
import { ScrollToTop } from '@/components/ScrollToTop';

// Demo deployment only; in production the imports are dropped from the bundle.
const DemoBanner = isDemoMode
  ? lazy(() => import('@/features/demo/components/DemoBanner/DemoBanner'))
  : null;
const DemoRuntime = isDemoMode
  ? lazy(() => import('@/features/demo/components/DemoRuntime/DemoRuntime'))
  : null;

const Layout = () => {
  const { toasts, removeToast } = useToast();
  useAuthSessionWatcher();

  return (
    <div className={styles.layout}>
      {DemoBanner ? (
        <Suspense fallback={null}>
          <DemoBanner />
        </Suspense>
      ) : null}
      <Header />
      <main className={styles.layout_main}>
        <ScrollToTop />
        <div className={styles.layout_content}>
          <Outlet />
        </div>
      </main>
      <Footer />
      {DemoRuntime ? (
        <Suspense fallback={null}>
          <DemoRuntime />
        </Suspense>
      ) : null}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
export { Layout };
