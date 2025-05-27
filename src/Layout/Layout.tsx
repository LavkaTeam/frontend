import { Outlet } from 'react-router';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

import styles from './Layout.module.css';

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.layout_main}>
        <div className={styles.layout_content}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
export { Layout };
