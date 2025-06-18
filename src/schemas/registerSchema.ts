import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(1, 'Company is required'),
  telephoneNumber: z
    .string()
    .min(1, 'Phone is required')
    .regex(
      /^\+[1-9]\d{1,14}$/,
      'Phone number must be in international format, e.g. +380XXXXXXXXX',
    ),
  role: z.enum(['SELLER', 'BUYER'], {
    required_error: 'Role is required',
  }),
});

export { registerSchema };
export type RegisterFormSchema = z.infer<typeof registerSchema>;
