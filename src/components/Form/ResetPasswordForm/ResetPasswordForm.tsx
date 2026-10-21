import type { UseFormSetError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useValidatedForm } from '@/hooks/useValidatedForm';

import { AuthRedirect } from '../AuthRedirect/AuthRedirect';
import { FormContainer } from '../FormContainer/FormContainer';
import { InputField } from '../InputField/InputField';
import { Button } from '@ui/Button';
import { Loader } from '@ui/Loader';
import { FormHeader } from '@ui/FormHeader';
import {
  resetPasswordSchema,
  type ResetPasswordFormSchema,
} from '@/schemas/resetPasswordSchema';
import { formatCooldown } from '@/utils/formatCooldown';

import styles from './ResetPasswordForm.module.css';

interface ResetPasswordFormProps {
  onSubmit: (
    data: ResetPasswordFormSchema,
    setError: UseFormSetError<ResetPasswordFormSchema>,
  ) => void;
  isLoading?: boolean;
  // Seconds left after 429 TOO_MANY_REQUESTS; blocks the submit button.
  cooldownSeconds?: number;
}

const ResetPasswordForm = ({
  onSubmit,
  isLoading = false,
  cooldownSeconds = 0,
}: ResetPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useValidatedForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <FormContainer>
      <FormHeader
        title='Set new password'
        subtitle='Must be at least 8 characters with 1 capital letter and 1 number.'
      />
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit((data) => onSubmit(data, setError))}
        autoComplete='on'
      >
        <InputField
          id='newPassword'
          label='New password'
          type='password'
          placeholder='••••••••'
          autoComplete='new-password'
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <InputField
          id='confirmPassword'
          label='Confirm password'
          type='password'
          placeholder='••••••••'
          autoComplete='new-password'
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />


        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Button type='submit' disabled={cooldownSeconds > 0}>
              {cooldownSeconds > 0
                ? `Try again in ${formatCooldown(cooldownSeconds)}`
                : 'Reset password'}
            </Button>
            <AuthRedirect type='resetPassword' />
          </>
        )}
      </form>
    </FormContainer>
  );
};

export { ResetPasswordForm };
