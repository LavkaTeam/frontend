import { Link } from 'react-router';
import { Logo } from '../Logo';
import { Button } from '@ui/Button';
import { ShoppingCart } from '../ShoppingCart';
import { OutlineHeart } from '../Heart';
import { Input } from '@ui/Input';

import { useLogOutHandler } from '@/hooks/useLogOutHandler';
import { AccountIcon } from '../AccountIcon';

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
              <img src='/icons/searchIcon.svg' alt='search' />
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
                <div>
                  <Button onClick={handleLogOut}>Log out</Button>
                </div>
              ) : (
                <>
                  {' '}
                  <div className={styles.authButtons}>
                    <Link to={'/login'} className={styles.loginButton}>
                      Log in
                    </Link>

                    <Link to={'/register'}>
                      <Button>Sign up</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
