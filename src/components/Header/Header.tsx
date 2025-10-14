import { Link } from 'react-router';
import { Logo } from '../Logo';
import { ShoppingCart } from '../ShoppingCart';
import { OutlineHeart } from '../ui/icons/Heart';
import { Input } from '@ui/Input';
import { useLogOutHandler } from '@/hooks/useLogOutHandler';
import { SearchIcon } from '../ui/icons/SearchIcon';
import { AccountIcon } from '../ui/icons/AccountIcon';
import { LogoutIcon } from '../ui/icons/LogoutIcon';
import { HeaderIcon } from '../HeaderIcon';
import { useAppSelector } from '@/store/hooks';
import styles from './Header.module.css';

const Header = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const cart = useAppSelector((state) => state.cart);
  const commonQuantity = cart.reduce((total, item) => total + item.quantity, 0);

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
                <Link to={`${isAuthenticated ? '/account' : '/login'}`}>
                  <HeaderIcon icon={<AccountIcon />} iconText='Account' />
                </Link>

                <Link to={'/favorites'}>
                  <HeaderIcon icon={<OutlineHeart />} iconText='Wishlist' />
                </Link>

                <Link to={'/cart'}>
                  <HeaderIcon
                    icon={<ShoppingCart currentColor='#252B37' />}
                    iconText='Cart'
                    count={commonQuantity}
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
