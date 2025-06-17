import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { InputField } from './InputField';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { FormHeader } from '../ui/FormHeader';
import { Checkbox } from '../ui/Checkbox';
import {
  registerSchema,
  type RegisterFormSchema,
} from '@/schemas/registerSchema';

import styles from './RegisterForm.module.css';

interface RegisterFormProps {
  onSubmit: (
    data: RegisterFormSchema,
    setError: ReturnType<typeof useForm<RegisterFormSchema>>['setError'],
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
    <div className={styles.formWrapper}>
      <div className={styles.formContainer}>
        <FormHeader title='Sign up' subtitle='Fill out the form to sign up' />
        <form
          onSubmit={handleSubmit((data) => onSubmit(data, setError))}
          autoComplete='on'
        >
          <InputField
            label='Name'
            placeholder='Enter your name'
            autoComplete='given-name'
            {...register('name')}
          />
          {errors.name && <p>{errors.name.message}</p>}

          <InputField
            label='Last Name'
            placeholder='Enter your last name'
            autoComplete='given-lastName'
            {...register('lastName')}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}

          <InputField
            label='Email'
            type='email'
            placeholder='Enter your email'
            autoComplete='email'
            {...register('email')}
          />
          {errors.email && <p>{errors.email.message}</p>}

          <InputField
            label='Password'
            type='password'
            placeholder='Enter your password'
            autoComplete='new-password'
            {...register('password')}
          />
          {errors.password && <p>{errors.password.message}</p>}

          <InputField
            label='Company name'
            placeholder='Enter your company name'
            autoComplete='organization'
            {...register('companyName')}
          />
          {errors.companyName && <p>{errors.companyName.message}</p>}

          <InputField
            label='Phone'
            type='tel'
            placeholder='Enter your phone number'
            autoComplete='tel'
            {...register('telephoneNumber')}
          />
          {errors.telephoneNumber && <p>{errors.telephoneNumber.message}</p>}

          <div style={{ marginTop: '16px' }}>
            <p>Select your role:</p>

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

          {isLoading ? <Loader /> : <Button type='submit'>Sign Up</Button>}
        </form>
      </div>
    </div>
  );
};

export { RegisterForm };
