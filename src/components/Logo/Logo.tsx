import { Link } from 'react-router-dom';

import styles from './Logo.module.css';

const Logo = () => {
  return (
    <Link
      to="/"
      className={styles.logo}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <img src="/icons/logo.svg" alt="B2Bar logo" />
    </Link>

  );
};

export { Logo };
