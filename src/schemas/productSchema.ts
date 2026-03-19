import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Name is too long'),
  category: z.string().min(2, 'Category is required'),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive('Price must be greater than 0'),
  ),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
