import { z } from 'zod';

const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(
      /^[A-Za-z-]{2,50}$/,
      'Name: 2-50 Latin letters and dashes only',
    ),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .regex(
      /^[A-Za-z-]{2,50}$/,
      'Last name: 2-50 Latin letters and dashes only',
    ),

  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email format'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      'Add at least 1 uppercase letter and 1 number',
    ),

  companyName: z
    .string()
    .min(2, 'Company name: at least 2 characters')
    .max(100, 'Company name: at most 100 characters')
    .regex(
      /^[A-Za-z0-9&.\-'\s]{2,100}$/,
      "Use Latin letters, numbers, spaces and & . - ' only",
    ),

  telephoneNumber: z
    .string()
    .min(1, 'Phone is required')
    .regex(
      /^\+\d{10,15}$/,
      'Use international format, e.g. +380991234567',
    ),

  role: z.enum(['SELLER', 'BUYER'], {
    required_error: 'Role is required',
  }),
});

export { registerSchema };
export type RegisterFormSchema = z.infer<typeof registerSchema>;
