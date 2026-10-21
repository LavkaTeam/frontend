import { Link } from 'react-router-dom';
import styles from './AuthRedirect.module.css';

const REDIRECTS = {
  signup: { text: 'Don’t have an account?', label: 'Sign up', to: '/register' },
  login: { text: 'Already have an account?', label: 'Log in', to: '/login' },
  rememberPassword: {
    text: 'Remember your password?',
    label: 'Log in',
    to: '/login',
  },
  resetPassword: {
    text: 'Link expired?',
    label: 'Request a new one',
    to: '/forgot-password',
  },
} as const;

interface AuthRedirectProps {
  type: keyof typeof REDIRECTS;
}

const AuthRedirect = ({ type }: AuthRedirectProps) => {
  const { text, label, to } = REDIRECTS[type];

  return (
    <div className={styles.redirectContainer}>
      <p className={styles.redirectText}>{text}</p>
      <Link className={styles.redirectLink} to={to}>
        {label}
      </Link>
    </div>
  );
};

export { AuthRedirect };
