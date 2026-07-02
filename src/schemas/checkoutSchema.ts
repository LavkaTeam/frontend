import { z } from 'zod';

const paymentMethods = z.enum([
  'INVOICE',
  'CASH_ON_DELIVERY',
  'CARD_ONLINE',
  'DEFERRED_PAYMENT',
]);

const deliveryTypes = z.enum(['COURIER', 'WAREHOUSE']);

const phoneRegex = /^\+380\d{9}$/;
const nameRegex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ' -]+$/;
const addressRegex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9'".,\/\-()# ]+$/;

const trimmedOptionalString = z.string().trim().optional();

const firstNameSchema = z
  .string()
  .trim()
  .min(2, 'First name must contain at least 2 characters')
  .max(40, 'First name must contain at most 40 characters')
  .regex(nameRegex, 'First name can contain only letters, spaces, apostrophes and hyphens');

const lastNameSchema = z
  .string()
  .trim()
  .min(2, 'Last name must contain at least 2 characters')
  .max(40, 'Last name must contain at most 40 characters')
  .regex(nameRegex, 'Last name can contain only letters, spaces, apostrophes and hyphens');

const citySchema = z
  .string()
  .trim()
  .min(2, 'City must contain at least 2 characters')
  .max(60, 'City must contain at most 60 characters')
  .regex(nameRegex, 'City can contain only letters, spaces, apostrophes and hyphens');

const warehouseSchema = z
  .string()
  .trim()
  .min(1, 'Warehouse number is required for warehouse delivery')
  .max(40, 'Warehouse number must contain at most 40 characters')
  .regex(
    /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 .\-/#]+$/,
    'Warehouse number contains unsupported characters',
  );

const addressLineSchema = z
  .string()
  .trim()
  .min(5, 'Street address must contain at least 5 characters')
  .max(120, 'Street address must contain at most 120 characters')
  .regex(addressRegex, 'Street address contains unsupported characters');

export const checkoutSchema = z
  .object({
    paymentMethod: paymentMethods,
    shippingDetails: z.object({
      firstName: firstNameSchema,
      lastName: lastNameSchema,
      phone: z
        .string()
        .trim()
        .regex(phoneRegex, 'Enter a valid phone number in format +380XXXXXXXXX'),
      city: citySchema,
      deliveryType: deliveryTypes,
      warehouseNumber: trimmedOptionalString,
      addressLine: trimmedOptionalString,
    }),
    orderComment: z
      .string()
      .trim()
      .max(400, 'Comment must contain at most 400 characters')
      .regex(
        /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9'".,!?():;\/\-#\n\r ]*$/,
        'Comment contains unsupported characters',
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shippingDetails.deliveryType === 'WAREHOUSE') {
      const warehouseResult = warehouseSchema.safeParse(
        data.shippingDetails.warehouseNumber,
      );

      if (!warehouseResult.success) {
        warehouseResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['shippingDetails', 'warehouseNumber'],
          });
        });
      }
    }

    if (data.shippingDetails.deliveryType === 'COURIER') {
      const addressResult = addressLineSchema.safeParse(
        data.shippingDetails.addressLine,
      );

      if (!addressResult.success) {
        addressResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['shippingDetails', 'addressLine'],
          });
        });
      }
    }
  });

export type CheckoutFormSchema = z.input<typeof checkoutSchema>;
export type CheckoutFormData = z.output<typeof checkoutSchema>;
