import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormContainer, InputField } from '@/components/Form';
import { Button } from '@ui/Button';
import { Loader } from '@ui/Loader';
import { FormHeader } from '@ui/FormHeader';
import { loginSchema, type LoginFormSchema } from '@/schemas/loginSchema';

interface LoginFormProps {
  onSubmit: (
    data: LoginFormSchema,
    setError: ReturnType<typeof useForm<LoginFormSchema>>['setError'],
  ) => void;
  isLoading?: boolean;
}

const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  return (
    <FormContainer>
      <FormHeader
        title='Log in'
        subtitle='Welcome back! Please enter your details.'
      />
      <form
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

        <InputField
          id='password'
          label='Password'
          type='password'
          placeholder='••••••••'
          autoComplete='current-password'
          error={errors.password?.message}
          {...register('password')}
        />

        {isLoading ? <Loader /> : <Button type='submit'>Log In</Button>}
      </form>
    </FormContainer>
  );
};

export { LoginForm };
