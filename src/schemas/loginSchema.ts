import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least 1 uppercase letter and 1 number',
    ),
});

export { loginSchema };
export type LoginFormSchema = z.infer<typeof loginSchema>;
