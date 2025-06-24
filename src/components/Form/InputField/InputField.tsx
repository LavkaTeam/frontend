import { Input } from '@ui/Input';
import { Label } from '@ui/Label';
import { ErrorIcon } from '@/components/ui/icons/ErrorIcon';

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
      <div className={styles.inputWrapper}>
        <Input
          id={id}
          {...rest}
          onFocus={handleFocus}
          onChange={onChange}
          error={!!error}
        />
        {error && (
          <span className={styles.icon}>
            <ErrorIcon />
          </span>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export { InputField };
