import { Link } from 'react-router';
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
import styles from './Header.module.css';

const Header = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const cart = useAppSelector((state) => state.cart);
  const favorites = useAppSelector((state) => state.favorites);

  const { data: remoteCart } = useGetCart(isAuthenticated);
  const { handleSubmit: handleLogOut } = useLogOutHandler();

  const cartCount = isAuthenticated ? (remoteCart?.items?.length || 0) : cart.length;

  return (
    <header className={styles.wrapper}>
      <div className='container'>
        <div className={styles.container}>
          <Logo />

          <div className={styles.headerContent}>
            <HeaderSearch />

            <div className={styles.userActions}>
              <div className={styles.actions}>
                <Link to={`${isAuthenticated ? '/account' : '/login'}`}>
                  <HeaderIcon icon={<AccountIcon />} iconText='Account' />
                </Link>

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
