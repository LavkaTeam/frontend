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
import { Toast } from '@/components/ui/Toast';

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePassword = ({ isOpen, onClose }: ChangePasswordProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Стан для тоста
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

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
      setToast(null);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, reset]);

  // 3 секунди -> закриваємо тост -> закриваємо модалку
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const onSubmit = (data: ChangePasswordFormSchema) => {
    console.log('Attempted change:', data);

    setToast({
      message: 'This feature is temporarily unavailable',
      type: 'error',
    });
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

        {toast && (
          <div className={styles.toastModal}>
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { ChangePassword };
