import styles from './HeadingH3.module.css';

interface HeadingProps {
  children: React.ReactNode;
}

const HeadingH3 = ({ children }: HeadingProps) => {
  return <h3 className={styles.heading}>{children}</h3>;
};

export { HeadingH3 };
