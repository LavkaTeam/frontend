import { forwardRef } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { SubHeading } from '@/components/ui/SubHeading';
import type { CheckoutFormSchema } from '@/schemas/checkoutSchema';
import type { OrderPaymentMethod } from '@/types/order';
import type { UserResponse } from '@/types/user';
import { CheckoutOptionCard } from './CheckoutOptionCard';
import { paymentMethodOptions } from './checkoutOptions';
import { getPaymentMethodDisabledReason, isPaymentMethodEnabled } from './checkoutUtils';
import styles from '@/pages/Checkout.module.css';

type CheckoutPaymentCardProps = {
  register: UseFormRegister<CheckoutFormSchema>;
  errors: FieldErrors<CheckoutFormSchema>;
  selectedPaymentMethod: OrderPaymentMethod;
  paymentWarning?: string;
  user?: UserResponse;
};

const CheckoutPaymentCard = forwardRef<HTMLDivElement, CheckoutPaymentCardProps>(
  ({ register, errors, selectedPaymentMethod, paymentWarning, user }, ref) => (
    <div ref={ref} className={styles.card}>
      <SubHeading color='secondary'>Payment and comment</SubHeading>

      <div className={styles.groupBlock}>
        <span className={styles.groupLabel}>Payment method</span>
        <div className={styles.paymentList}>
          {paymentMethodOptions.map((option) => (
            <CheckoutOptionCard
              key={option.value}
              title={option.title}
              description={option.description}
              hint={getPaymentMethodDisabledReason(option.value, user)}
              icon={option.icon}
              selected={selectedPaymentMethod === option.value}
              disabled={!isPaymentMethodEnabled(option.value, user)}
              inputProps={register('paymentMethod')}
              kind='payment'
              value={option.value}
            />
          ))}
        </div>
        {errors.paymentMethod ? <p className={styles.error}>{errors.paymentMethod.message}</p> : null}
      </div>

      {paymentWarning ? <p className={styles.paymentWarning}>{paymentWarning}</p> : null}

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Order comment</span>
        <textarea
          className={`${styles.textarea} ${errors.orderComment ? styles.textareaError : ''}`}
          rows={5}
          placeholder='Add delivery or document notes if needed'
          {...register('orderComment')}
        />
        {errors.orderComment ? <p className={styles.error}>{errors.orderComment.message}</p> : null}
      </label>
    </div>
  ),
);

CheckoutPaymentCard.displayName = 'CheckoutPaymentCard';

export { CheckoutPaymentCard };
