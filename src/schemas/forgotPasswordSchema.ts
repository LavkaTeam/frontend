import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email format'),
});

export { forgotPasswordSchema };
export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>;
