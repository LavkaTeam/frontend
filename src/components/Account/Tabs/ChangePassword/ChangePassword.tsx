import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/Form';
import styles from './ChangePassword.module.css';
import {
  changePasswordSchema,
  type ChangePasswordFormSchema,
} from '@/schemas/changePasswordSchema';

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePassword = ({ isOpen, onClose }: ChangePasswordProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
      reset();
    } else {
      setIsVisible(false);
    }
  }, [isOpen, reset]);

  const onSubmit = (data: ChangePasswordFormSchema) => {
    // Тут буде логіка зміни пароля
    console.log('Changing password:', data);
    onClose();
  };

  const handleTransitionEnd = () => {
    if (!isVisible) {
      onClose();
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`${styles.overlay} ${isVisible ? styles.open : ''}`}
      onClick={onClose}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Change password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <InputField
            id='currentPassword'
            label='Current Password'
            type='password'
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <InputField
            id='newPassword'
            label='New Password'
            type='password'
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <InputField
            id='confirmPassword'
            label='Confirm New Password'
            type='password'
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className={styles.buttonContainer}>
            <Button type='submit'>Change Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
