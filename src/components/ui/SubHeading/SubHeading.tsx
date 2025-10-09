import styles from './SubHeading.module.css';

interface SubHeadingProps {
  children: React.ReactNode;
  size?: 'large' | 'medium' | 'small';
  color?: 'primary' | 'secondary';
}

const SubHeading = ({
  children,
  size = 'large',
  color = 'primary',
}: SubHeadingProps) => {
  return (
    <div className={`${styles.subheading} ${styles[color]} ${styles[size]}`}>
      <p>{children}</p>
    </div>
  );
};
export { SubHeading };
