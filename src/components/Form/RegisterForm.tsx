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
            id='name'
            placeholder='Оlivia'
            autoComplete='given-name'
            error={errors.name?.message}
            {...register('name')}
          />
          <InputField
            id='lastName'
            placeholder='Sandra'
            autoComplete='family-name'
            error={errors.lastName?.message}
            {...register('lastName')}
          />
          <InputField
            id='email'
            type='email'
            placeholder='olivia@untitledui.com'
            autoComplete='email'
            error={errors.email?.message}
            {...register('email')}
          />
          <InputField
            id='password'
            type='password'
            placeholder='••••••••'
            autoComplete='new-password'
            error={errors.password?.message}
            {...register('password')}
          />
          <InputField
            id='companyName'
            placeholder='Craft and Style'
            autoComplete='organization'
            error={errors.companyName?.message}
            {...register('companyName')}
          />
          <InputField
            id='telephoneNumber'
            type='tel'
            placeholder='+1 (555) 000-0000'
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

          {isLoading ? <Loader /> : <Button type='submit'>Sign Up</Button>}
        </form>
      </div>
    </div>
  );
};

export { RegisterForm };
