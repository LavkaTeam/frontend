import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

import styles from './InputField.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const InputField = ({ label, id, ...rest }: InputFieldProps) => {
  return (
    <div className={styles.field}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...rest} />
    </div>
  );
};

export { InputField };
