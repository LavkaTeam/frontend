import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useValidatedForm } from '@/hooks/useValidatedForm';

import {
  FormContainer,
  InputField,
  AuthRedirect,
} from '@/components/Form';
import { Button } from '@ui/Button';
import { Loader } from '@ui/Loader';
import { FormHeader } from '@ui/FormHeader';
import { loginSchema, type LoginFormSchema } from '@/schemas/loginSchema';
import { formatCooldown } from '@/utils/formatCooldown';

import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSubmit: (
    data: LoginFormSchema,
    setError: ReturnType<typeof useForm<LoginFormSchema>>['setError'],
  ) => void;
  isLoading?: boolean;
  // Seconds left after 429 TOO_MANY_REQUESTS; blocks the submit button.
  cooldownSeconds?: number;
  // Restores the email when the user comes back from a status screen.
  defaultEmail?: string;
}

const LoginForm = ({
  onSubmit,
  isLoading = false,
  cooldownSeconds = 0,
  defaultEmail = '',
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useValidatedForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: defaultEmail, password: '' },
  });

  return (
    <FormContainer>
      <FormHeader
        title='Log in'
        subtitle='Welcome back! Please enter your details.'
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
          invalid={Boolean(errors.email)}
          {...register('email')}
        />

        <InputField
          id='password'
          label='Password'
          type='password'
          placeholder='••••••••'
          autoComplete='current-password'
          error={errors.password?.message}
          {...register('password')}
        />

        <div className={styles.forgotPassword}>
          <Link className={styles.forgotPasswordLink} to='/forgot-password'>
            Forgot password?
          </Link>
        </div>


        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Button type='submit' disabled={cooldownSeconds > 0}>
              {cooldownSeconds > 0
                ? `Try again in ${formatCooldown(cooldownSeconds)}`
                : 'Log In'}
            </Button>
            <AuthRedirect type='signup' />
          </>
        )}
      </form>
    </FormContainer>
  );
};

export { LoginForm };
