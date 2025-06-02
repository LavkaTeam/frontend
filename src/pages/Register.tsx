import { useState } from 'react';
import type { AuthPayload } from '../types/auth';
import { useRegister } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';

const Register = () => {
  const queryClient = useQueryClient();
  const register = useRegister();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState<AuthPayload>({
    name: '',
    email: '',
    password: '',
    companyName: '',
    telephoneNumber: '',
    role: 'BUYER',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(form, {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        dispatch(setUser(data.user));
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/');
      },
      onError: (error: Error) => {
        alert(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name='name'
          value={form.name}
          onChange={handleChange}
          type='text'
          placeholder='Type Your name'
          required
        />
        <input
          name='email'
          value={form.email}
          onChange={handleChange}
          type='email'
          placeholder='Email'
          autoComplete='email'
          required
        />
        <input
          name='password'
          value={form.password}
          onChange={handleChange}
          type='password'
          placeholder='Password'
          autoComplete='new-password'
          required
        />
        <input
          name='companyName'
          value={form.companyName}
          onChange={handleChange}
          type='text'
          placeholder='Company name'
          required
        />
        <input
          name='telephoneNumber'
          value={form.telephoneNumber}
          onChange={handleChange}
          type='tel'
          placeholder='Telephone number'
          autoComplete='tel'
          required
        />
        <div>
          <label>
            <input
              type='radio'
              name='role'
              value='BUYER'
              checked={form.role === 'BUYER'}
              onChange={handleChange}
            />
            Buyer
          </label>
          <label>
            <input
              type='radio'
              name='role'
              value='SELLER'
              checked={form.role === 'SELLER'}
              onChange={handleChange}
            />
            Seller
          </label>
        </div>
      </div>
      <button type='submit' disabled={register.isPending}>
        {register.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export { Register };
