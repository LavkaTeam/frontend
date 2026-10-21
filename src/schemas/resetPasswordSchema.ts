import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        'Add at least 1 uppercase letter and 1 number',
      ),

    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export { resetPasswordSchema };
export type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>;
