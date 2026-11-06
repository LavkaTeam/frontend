import { Suspense, lazy } from 'react';
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
import { isDemoMode } from '@/features/demo/config';
import styles from './Header.module.css';

// Demo deployment only; in production the imports are dropped from the bundle.
const DemoBadge = isDemoMode
  ? lazy(() => import('@/features/demo/components/DemoBadge/DemoBadge'))
  : null;
const DemoLogout = isDemoMode
  ? lazy(() => import('@/features/demo/components/DemoLogout/DemoLogout'))
  : null;
const DemoTryButton = isDemoMode
  ? lazy(() => import('@/features/demo/components/DemoTryButton/DemoTryButton'))
  : null;

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
          {DemoBadge ? (
            <div className={styles.brand}>
              <Logo />
              <Suspense fallback={null}>
                <DemoBadge />
              </Suspense>
            </div>
          ) : (
            <Logo />
          )}

          <div className={styles.headerContent}>
            <HeaderSearch />

            <div className={styles.userActions}>
              <div className={styles.actions}>
                {/* The demo has no login: "Try demo" takes the place of Account. */}
                {DemoTryButton && !isAuthenticated ? (
                  <Suspense fallback={null}>
                    <DemoTryButton />
                  </Suspense>
                ) : (
                  <Link to={accountLink}>
                    <HeaderIcon
                      icon={<AccountIcon />}
                      iconText={isAdmin ? 'Admin' : 'Account'}
                    />
                  </Link>
                )}

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
              {isAuthenticated &&
                (DemoLogout ? (
                  // In the demo, leaving ends the sandbox.
                  <Suspense fallback={null}>
                    <DemoLogout className={styles.logoutButton} />
                  </Suspense>
                ) : (
                  <div className={styles.logoutButton} onClick={handleLogOut}>
                    <HeaderIcon icon={<LogoutIcon />} iconText='Logout' />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
