import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: ReactNode;
  variant?: 'secondary';
  isLoading?: boolean;
}

const Button = ({
  children,
  variant,
  icon,
  isLoading,
  disabled,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`${variant ? styles.buttonSecondary : styles.button} ${
        isLoading ? styles.loading : ''
      } ${className || ''}`.trim()}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden='true' /> : null}
      {!isLoading && icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{children}</span>
    </button>
  );
};
export { Button };
