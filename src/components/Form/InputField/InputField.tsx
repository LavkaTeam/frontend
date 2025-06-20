import { Input } from '@ui/Input';
import { Label } from '@ui/Label';

import styles from './InputField.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const InputField = ({
  label,
  id,
  error,
  onFocus,
  onChange,
  ...rest
}: InputFieldProps) => {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (id === 'telephoneNumber' && !e.target.value) {
      e.target.value = '+380';
      onChange?.({ ...e, target: { ...e.target, value: '+380' } });
    }
    onFocus?.(e);
  };

  return (
    <div className={styles.field}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...rest} onFocus={handleFocus} onChange={onChange} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export { InputField };
