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
  // Marks the field as invalid without a message of its own, e.g. the email
  // field when the message "Invalid email or password" sits under password.
  invalid?: boolean;
}

const InputField = ({
  label,
  id,
  error,
  invalid,
  type,
  onFocus,
  onChange,
  ...rest
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  // The last message stays rendered while it fades out, so the text does not
  // vanish before the opacity transition ends.
  const [lastError, setLastError] = useState('');

  if (error && error !== lastError) {
    setLastError(error);
  }

  const isInvalid = invalid ?? Boolean(error);
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if ((id === 'telephoneNumber' || id === 'phoneNumber') && !e.target.value) {
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
          error={isInvalid}
          aria-invalid={isInvalid}
        />
        {isPassword ? (
          <span
            className={styles.icon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <ShowPassword /> : <ClosePassword />}
          </span>
        ) : (
          isInvalid && (
            <span className={`${styles.icon} ${styles.errorIcon}`}>
              <ErrorIcon />
            </span>
          )
        )}
      </div>
      <p
        className={`${styles.error} ${error ? styles.errorVisible : ''}`}
        aria-hidden={!error}
      >
        {lastError || ' '}
      </p>
    </div>
  );
};

export { InputField };
