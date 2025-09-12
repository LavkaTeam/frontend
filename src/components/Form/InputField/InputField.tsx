import { useState } from 'react';
import { Input } from '@ui/Input';
import { Label } from '@ui/Label';
import { ErrorIcon } from '@/components/ui/icons/ErrorIcon';
import {
  ClosePassword,
  ShowPassword,
} from '@/components/ui/icons/PasswordIcons';
import styles from './InputField.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
}

const InputField = ({
  label,
  id,
  error,
  type,
  onFocus,
  onChange,
  ...rest
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (id === 'telephoneNumber' && !e.target.value) {
      e.target.value = '+380';
      onChange?.({ ...e, target: { ...e.target, value: '+380' } });
    }
    onFocus?.(e);
  };

  return (
    <div className={styles.field}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={styles.inputWrapper}>
        <Input
          id={id}
          type={actualType}
          {...rest}
          onFocus={handleFocus}
          onChange={onChange}
          error={!!error}
        />
        {isPassword ? (
          <span
            className={styles.icon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <ShowPassword /> : <ClosePassword />}
          </span>
        ) : (
          error && (
            <span className={styles.icon}>
              <ErrorIcon />
            </span>
          )
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export { InputField };
