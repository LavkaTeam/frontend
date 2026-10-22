import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { ShoppingCart } from '../ShoppingCart';
import { OutlineHeart } from '../ui/icons/Heart';
import { useLogOutHandler } from '@/hooks/useLogOutHandler';
import { AccountIcon } from '../ui/icons/AccountIcon';
import { LogoutIcon } from '../ui/icons/LogoutIcon';
import { HeaderIcon } from '../HeaderIcon';
import { HeaderSearch } from './HeaderSearch';
import { useAppSelector } from '@/store/hooks';
import { useGetCart } from '@/hooks/useCartQueries';
import {
  useIsAdmin,
  useIsAuthenticated,
  useIsShopper,
} from '@/hooks/useIsAuthenticated';
import styles from './Header.module.css';

const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  // The admin has no cart or favorites (the backend answers 403).
  const isShopper = useIsShopper();

  const cart = useAppSelector((state) => state.cart);
  const favorites = useAppSelector((state) => state.favorites);

  const { data: remoteCart } = useGetCart(isShopper);
  const { handleSubmit: handleLogOut } = useLogOutHandler();

  const cartCount = isShopper ? (remoteCart?.items?.length || 0) : cart.length;
  const accountLink = isAdmin ? '/admin' : isAuthenticated ? '/account' : '/login';

  return (
    <header className={styles.wrapper}>
      <div className='container'>
        <div className={styles.container}>
          <Logo />

          <div className={styles.headerContent}>
            <HeaderSearch />

            <div className={styles.userActions}>
              <div className={styles.actions}>
                <Link to={accountLink}>
                  <HeaderIcon
                    icon={<AccountIcon />}
                    iconText={isAdmin ? 'Admin' : 'Account'}
                  />
                </Link>

                {!isAdmin && (
                  <>
                    <Link to={'/favorites'}>
                      <HeaderIcon
                        icon={<OutlineHeart />}
                        iconText='Wishlist'
                        count={favorites.length}
                      />
                    </Link>

                    <Link to={'/cart'}>
                      <HeaderIcon
                        icon={<ShoppingCart currentColor='#252B37' />}
                        iconText='Cart'
                        count={cartCount}
                      />
                    </Link>
                  </>
                )}
              </div>
              {isAuthenticated && (
                <div className={styles.logoutButton} onClick={handleLogOut}>
                  <HeaderIcon icon={<LogoutIcon />} iconText='Logout' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
