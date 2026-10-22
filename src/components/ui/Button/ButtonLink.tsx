import type { ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import styles from './Button.module.css';

interface ButtonLinkProps extends LinkProps {
  children: ReactNode;
  variant?: 'secondary';
}

// A link that looks like Button, for navigation (a <button> inside <a> is
// invalid HTML).
const ButtonLink = ({
  children,
  variant,
  className,
  ...rest
}: ButtonLinkProps) => (
  <Link
    className={`${variant ? styles.buttonSecondary : styles.button} ${
      className || ''
    }`.trim()}
    {...rest}
  >
    {children}
  </Link>
);

export { ButtonLink };
