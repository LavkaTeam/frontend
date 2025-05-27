import { Link } from 'react-router';
import styles from './Header.module.css';

const Header = () => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  return (
    <header className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <Link to={'/'} className={styles.navLink}>
            <p className={styles.header_logo}>Logo</p>
          </Link>
        </div>
        <div>
          {user ? (
            <span>Welcome, {user.name}</span>
          ) : (
            <Link to={'/register'} className={styles.navLink}>
              Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
export { Header };
