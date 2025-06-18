import { z } from 'zod';

const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[A-Za-z\-]{2,50}$/, 'Name must be 2-50 letters and dashes only'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .regex(
      /^[A-Za-z\-]{2,50}$/,
      'Last name must be 2-50 letters and dashes only',
    ),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least 1 uppercase letter and 1 number',
    ),

  companyName: z
    .string()
    .min(1, 'Company is required')
    .regex(/^[A-Za-z0-9&.\-'\s]{2,100}$/, 'Invalid company name'),

  telephoneNumber: z
    .string()
    .min(1, 'Phone is required')
    .regex(
      /^\+\d{10,15}$/,
      'Phone must be in international format like +380991234567',
    ),

  role: z.enum(['SELLER', 'BUYER'], {
    required_error: 'Role is required',
  }),
});

export { registerSchema };
export type RegisterFormSchema = z.infer<typeof registerSchema>;
