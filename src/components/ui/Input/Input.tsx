import { type InputHTMLAttributes } from 'react';

import styles from './Input.module.css';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ ...rest }: InputProps) => {
  return <input className={styles.input} {...rest} />;
};

export { Input };
