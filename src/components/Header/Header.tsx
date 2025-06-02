import { Link } from 'react-router';
import styles from './Header.module.css';
import { useAppSelector } from '../../hooks/reduxHooks';

const Header = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <Link to={'/'} className={styles.navLink}>
            <p className={styles.header_logo}>Logo</p>
          </Link>
        </div>
        <div>
          {user?.name ? (
            <span>Hello, {user.name}</span>
          ) : (
            <Link to='/register' className={styles.navLink}>
              Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
export { Header };
