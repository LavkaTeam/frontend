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
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = id === 'password';
  const actualType = isPassword && showPassword ? 'text' : rest.type;

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
          type={actualType}
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
