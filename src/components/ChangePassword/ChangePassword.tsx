import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { useQueryClient } from '@tanstack/react-query';
import { changePassword } from '@/api/user';
import { saveAuthTokens } from '@/shared/api/client';
import { extractErrorMessage } from '@/utils/error';
import { applyServerFieldErrors } from '@/utils/formErrors';
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
  const [shouldRender, setShouldRender] = useState(false);
  const queryClient = useQueryClient();

  // Стан для тоста
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useValidatedForm<ChangePasswordFormSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      reset();
      setToast(null);
    } else if (shouldRender) {
      setIsVisible(false);
    }
  }, [isOpen, reset, shouldRender]);

  useEffect(() => {
    if (!shouldRender || !isOpen) return;

    const openTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 16);

    return () => window.clearTimeout(openTimer);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender]);

  const requestClose = () => {
    setIsVisible(false);
  };

  const onSubmit = async (data: ChangePasswordFormSchema) => {
    try {
      const response = await changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // Old tokens are revoked by the backend; without the new pair the
      // next request would log the user out.
      saveAuthTokens(response);
      await queryClient.invalidateQueries({ queryKey: ['user'] });

      setToast({
        message: 'Password changed successfully',
        type: 'success',
      });

      window.setTimeout(() => {
        requestClose();
      }, 900);
    } catch (error) {
      const hasFieldErrors = applyServerFieldErrors(error, setError, {
        currentPassword: ['oldPassword', 'currentPassword'],
        newPassword: ['newPassword'],
      });
      if (hasFieldErrors) return;

      const message = extractErrorMessage(error, 'Failed to change password');

      setToast({
        message,
        type: 'error',
      });
    }
  };

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (
      event.target === event.currentTarget &&
      event.propertyName === 'opacity' &&
      !isVisible
    ) {
      setShouldRender(false);
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`${styles.overlay} ${isVisible ? styles.open : ''}`}
      onClick={requestClose}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Change password</h2>
          <button
            type='button'
            className={styles.closeButton}
            onClick={requestClose}
            aria-label='Close password modal'
          >
            ✕
          </button>
        </div>

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
            <Button type='submit' isLoading={isSubmitting}>
              Change Password
            </Button>
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
