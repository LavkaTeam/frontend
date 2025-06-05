import styles from './Heading.module.css';

interface HeadingProps {
  children: React.ReactNode;
}

const Heading = ({ children }: HeadingProps) => {
  return <h3 className={styles.heading}>{children}</h3>;
};

export { Heading };
