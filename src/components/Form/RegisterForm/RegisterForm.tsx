import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormContainer, InputField, AuthRedirect } from '@/components/Form';
import { Button } from '@ui/Button';
import { Loader } from '@ui/Loader';
import { FormHeader } from '@ui/FormHeader';
import { Checkbox } from '@ui/Checkbox';
import {
  registerSchema,
  type RegisterFormSchema,
} from '@/schemas/registerSchema';

import styles from './RegisterForm.module.css';

interface RegisterFormProps {
  onSubmit: (
    data: RegisterFormSchema,
    setError: ReturnType<typeof useForm<RegisterFormSchema>>['setError']
  ) => void;
  isLoading?: boolean;
}

const RegisterForm = ({ onSubmit, isLoading = false }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
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

  return (
    <FormContainer>
      <FormHeader title='Sign up' subtitle='Fill out the form to sign up' />
      <form
        noValidate
        onSubmit={handleSubmit((data) => onSubmit(data, setError))}
        autoComplete='on'
      >
        <InputField
          id='name'
          label='Name'
          placeholder='Оlivia'
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
          {errors.role && <p>{errors.role.message}</p>}
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Button type='submit'>Sign Up</Button>
            <AuthRedirect type='login' />
          </>
        )}
      </form>
    </FormContainer>
  );
};

export { RegisterForm };
