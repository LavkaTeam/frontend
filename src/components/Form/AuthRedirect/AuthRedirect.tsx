import { Link } from 'react-router';
import styles from './AuthRedirect.module.css';

interface AuthRedirectProps {
  type: 'signup' | 'login';
}

const AuthRedirect = ({ type }: AuthRedirectProps) => {
  return (
    <>
      {type === 'signup' && (
        <div className={styles.redirectContainer}>
          <p className={styles.redirectText}>Don’t have an account?</p>
          <Link className={styles.redirectLink} to={'/register'}>
            Sign up
          </Link>
        </div>
      )}
      {type === 'login' && (
        <div className={styles.redirectContainer}>
          <p className={styles.redirectText}>Already have an account? </p>
          <Link className={styles.redirectLink} to={'/login'}>
            Log in
          </Link>
        </div>
      )}
    </>
  );
};

export { AuthRedirect };
