import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
}

const Button = ({ children }: ButtonProps) => {
  return <button className={styles.button}>{children}</button>;
};
export { Button };
