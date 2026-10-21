import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Checkbox } from '@ui/Checkbox';
import {
  registerSchema,
  type RegisterFormSchema,
} from '@/schemas/registerSchema';
import { formatCooldown } from '@/utils/formatCooldown';

import styles from './RegisterForm.module.css';

interface RegisterFormProps {
  onSubmit: (
    data: RegisterFormSchema,
    setError: ReturnType<typeof useForm<RegisterFormSchema>>['setError'],
  ) => void;
  isLoading?: boolean;
  // Seconds left after 429 TOO_MANY_REQUESTS; blocks the submit button.
  cooldownSeconds?: number;
}

const RegisterForm = ({
  onSubmit,
  isLoading = false,
  cooldownSeconds = 0,
}: RegisterFormProps) => {
  const [isConsent, setIsConsent] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useValidatedForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'BUYER',
    },
  });

  const role = watch('role');

  const handleRoleChange = (value: 'SELLER' | 'BUYER') => {
    if (role !== value) {
      setValue('role', value);
    }
  };

  const handleConsentChange = () => {
    setIsConsent((isConsent) => !isConsent);
    setShowConsentError(false);
  };

  const submitForm = handleSubmit((data) => {
    if (!isConsent) {
      setShowConsentError(true);
      return;
    }

    onSubmit(data, setError);
  });

  return (
    <FormContainer>
      <FormHeader title='Sign up' subtitle='Fill out the form to sign up' />
      <form
        className={styles.form}
        noValidate
        onSubmit={submitForm}
        autoComplete='on'
      >
        <InputField
          id='name'
          label='Name'
          placeholder='Olivia'
          autoComplete='given-name'
          error={errors.name?.message}
          {...register('name')}
        />
        <InputField
          id='lastName'
          label='Last Name'
          placeholder='Sandra'
          autoComplete='family-name'
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <InputField
          id='email'
          label='Email'
          type='email'
          placeholder='olivia@untitledui.com'
          autoComplete='email'
          error={errors.email?.message}
          {...register('email')}
        />
        <InputField
          id='password'
          label='Password'
          type='password'
          placeholder='••••••••'
          autoComplete='new-password'
          error={errors.password?.message}
          {...register('password')}
        />
        <InputField
          id='companyName'
          label='Company name'
          placeholder='Craft and Style'
          autoComplete='organization'
          error={errors.companyName?.message}
          {...register('companyName')}
        />
        <InputField
          id='telephoneNumber'
          label='Phone'
          type='tel'
          placeholder='+380 (00) 000-00 00'
          autoComplete='tel'
          error={errors.telephoneNumber?.message}
          {...register('telephoneNumber')}
        />

        <div className={styles.consentWarning}>
          <Checkbox
            label='I consent to the processing of my personal data'
            checked={isConsent}
            onChange={handleConsentChange}
          />
          {showConsentError && (
            <p className={styles.fieldError} role='alert'>
              Please accept the processing of your personal data to continue.
            </p>
          )}
        </div>

        <div className={styles.checkBoxContainer}>
          <Checkbox
            label='Seller'
            checked={role === 'SELLER'}
            onChange={() => handleRoleChange('SELLER')}
          />
          <Checkbox
            label='Buyer'
            checked={role === 'BUYER'}
            onChange={() => handleRoleChange('BUYER')}
          />

          <input type='hidden' {...register('role')} />
          {errors.role && (
            <p className={styles.fieldError}>{errors.role.message}</p>
          )}
        </div>


        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Button type='submit' disabled={cooldownSeconds > 0}>
              {cooldownSeconds > 0
                ? `Try again in ${formatCooldown(cooldownSeconds)}`
                : 'Sign Up'}
            </Button>
            <AuthRedirect type='login' />
          </>
        )}
      </form>
    </FormContainer>
  );
};

export { RegisterForm };
