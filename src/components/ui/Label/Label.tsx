import styles from './Label.module.css';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label = ({ children, ...rest }: LabelProps) => {
  return (
    <label className={styles.label} {...rest}>
      {children}
    </label>
  );
};

export { Label };
