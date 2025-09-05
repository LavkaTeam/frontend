import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: ReactNode;
  variant?: 'secondary';
}

const Button = ({ children, variant, icon, ...rest }: ButtonProps) => {
  return (
    <button
      className={`${variant ? styles.buttonSecondary : styles.button}`}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};
export { Button };
