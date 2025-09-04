import styles from './SubHeading.module.css';

interface SubHeadingProps {
  children: React.ReactNode;
}

const SubHeading = ({ children }: SubHeadingProps) => {
  return (
    <div className={styles.subheading}>
      <p>{children}</p>
    </div>
  );
};
export { SubHeading };
