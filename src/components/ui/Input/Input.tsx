import { type InputHTMLAttributes } from 'react';

import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | undefined;
}

const Input = ({ error, ...rest }: InputProps) => {
  return (
    <input
      className={`${styles.input} ${error ? styles.error : ''}`}
      {...rest}
    />
  );
};

export { Input };
