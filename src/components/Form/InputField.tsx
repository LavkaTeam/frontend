import { Input } from '../ui/Input';

import styles from './InputField.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
}

const InputField = ({ id, error, ...rest }: InputFieldProps) => {
  return (
    <div className={styles.field}>
      <Input id={id} {...rest} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export { InputField };
