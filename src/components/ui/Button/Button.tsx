import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: ReactNode;
  variant?: 'secondary';
  isLoading?: boolean;
}

const Button = ({ children, variant, icon, isLoading, disabled, ...rest }: ButtonProps) => {
  return (
    <button
      className={`${variant ? styles.buttonSecondary : styles.button} ${
        isLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''
      }`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="inline-block mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
      ) : (
        icon && <span className={styles.icon}>{icon}</span>
      )}
      {children}
    </button>
  );
};
export { Button };
