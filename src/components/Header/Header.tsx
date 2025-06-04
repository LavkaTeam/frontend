import { Link } from 'react-router';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.wrapper}>
      <div className="container">
        <div className={styles.container}>

          <Link to={'/'} className={styles.logo}>
            <img src="/icons/logo.svg" alt="B2Bar logo" />
          </Link>

          <div className={styles.searchBox}>
            <input
              name='text'
              type="text"
              placeholder='Search'
              className={styles.searchInput} />
              <img src="/icons/searchIcon.svg" alt="search" />
          </div>

          <div className={styles.buttons}>
            <div className={styles.authButtons}>
              <Link to={'/register'} className={styles.loginButton}>
                Log in
              </Link>
              <Link to={'/register'} className={styles.signupButton}>
                Sign up
              </Link>
            </div>

            <Link to={'/'} className={styles.cartButton}>
              <img src="/icons/cartIcon.svg" alt="Go to cart" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };