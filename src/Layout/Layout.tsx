import { Outlet } from 'react-router';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

import styles from './Layout.module.css';
import { ScrollToTop } from '@/components/ScrollToTop';

const Layout = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.layout_main}>
        <ScrollToTop />
        <div className={styles.layout_content}>
          <Outlet />
        </div>
      </main>
      <Footer />
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
