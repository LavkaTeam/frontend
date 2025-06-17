import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

import styles from './InputField.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField = ({ label, ...rest }: InputFieldProps) => {
  return (
    <div className={styles.field}>
      <Label {...rest}>{label}</Label>
      <Input {...rest} />
    </div>
  );
};

export { InputField };
