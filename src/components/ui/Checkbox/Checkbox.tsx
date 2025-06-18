import styles from './Checkbox.module.css';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = ({ label, ...rest }: CheckboxProps) => {
  return (
    <label className={styles.customCheckbox}>
      <input type='checkbox' className={styles.checkboxInput} {...rest} />
      <span className={styles.checkboxCustom}></span>
      <span className={styles.labelText}>{label}</span>
    </label>
  );
};

export { Checkbox };
