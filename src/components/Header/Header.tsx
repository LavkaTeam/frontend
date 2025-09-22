import { Link } from 'react-router';
import { Logo } from '../Logo';
import { ShoppingCart } from '../ShoppingCart';
import { OutlineHeart } from '../ui/icons/Heart';
import { Input } from '@ui/Input';

import { useLogOutHandler } from '@/hooks/useLogOutHandler';
import { SearchIcon } from '../ui/icons/SearchIcon';
import { AccountIcon } from '../ui/icons/AccountIcon';
import { LoginIcon } from '../ui/icons/LoginIcon';
import { LogoutIcon } from '../ui/icons/LogoutIcon';

import styles from './Header.module.css';

const Header = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const { handleSubmit: handleLogOut } = useLogOutHandler();

  return (
    <header className={styles.wrapper}>
      <div className='container'>
        <div className={styles.container}>
          <Logo />

          <div className={styles.headerContent}>
            <div className={styles.searchBox}>
              <Input name='text' type='text' placeholder='Search' />
              <div className={styles.searchBoxIcon}>
                <SearchIcon />
              </div>
            </div>

            <div className={styles.userActions}>
              <div className={styles.actions}>
                {isAuthenticated && (
                  <Link to={'/account'}>
                    <AccountIcon />
                  </Link>
                )}

                <Link to={'/favorites'}>
                  <OutlineHeart />
                </Link>

                <Link to={'/cart'}>
                  <ShoppingCart currentColor='#252B37' />
                </Link>
              </div>
              {isAuthenticated ? (
                <div className={styles.logoutButton} onClick={handleLogOut}>
                  <LogoutIcon />
                </div>
              ) : (
                <Link to={'/login'}>
                  <LoginIcon />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
