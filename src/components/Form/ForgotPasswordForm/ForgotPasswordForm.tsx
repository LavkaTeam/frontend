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
  forgotPasswordSchema,
  type ForgotPasswordFormSchema,
} from '@/schemas/forgotPasswordSchema';
import { formatCooldown } from '@/utils/formatCooldown';

import styles from './ForgotPasswordForm.module.css';

interface ForgotPasswordFormProps {
  onSubmit: (
    data: ForgotPasswordFormSchema,
    setError: UseFormSetError<ForgotPasswordFormSchema>,
  ) => void;
  isLoading?: boolean;
  // Seconds left after 429 TOO_MANY_REQUESTS; blocks the submit button.
  cooldownSeconds?: number;
}

const ForgotPasswordForm = ({
  onSubmit,
  isLoading = false,
  cooldownSeconds = 0,
}: ForgotPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useValidatedForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <FormContainer>
      <FormHeader
        title='Forgot password?'
        subtitle='No worries, we will send you reset instructions.'
      />
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit((data) => onSubmit(data, setError))}
        autoComplete='on'
      >
        <InputField
          id='email'
          label='Email'
          type='email'
          placeholder='olivia@untitledui.com'
          autoComplete='email'
          error={errors.email?.message}
          {...register('email')}
        />


        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Button type='submit' disabled={cooldownSeconds > 0}>
              {cooldownSeconds > 0
                ? `Try again in ${formatCooldown(cooldownSeconds)}`
                : 'Send reset link'}
            </Button>
            <AuthRedirect type='rememberPassword' />
          </>
        )}
      </form>
    </FormContainer>
  );
};

export { ForgotPasswordForm };
