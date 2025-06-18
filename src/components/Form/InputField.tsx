import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

import styles from './InputField.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const InputField = ({ label, id, error, ...rest }: InputFieldProps) => {
  return (
    <div className={styles.field}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...rest} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export { InputField };
