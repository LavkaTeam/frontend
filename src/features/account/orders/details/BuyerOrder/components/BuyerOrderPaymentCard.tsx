import { Button } from '@/components/ui/Button';
import type { OrderResponseDto } from '@/types/order';

import {
  canRetryOnlinePayment,
  formatPaymentMethod,
  formatPaymentStatus,
} from '../../../model/orderDisplay';
import styles from '../BuyerOrder.module.css';

interface BuyerOrderPaymentCardProps {
  order: OrderResponseDto;
  viewerRole: 'BUYER' | 'SELLER' | 'ADMIN';
  onContinuePayment?: () => void;
  isPaymentActionPending?: boolean;
}

const getPaymentNote = (
  order: OrderResponseDto,
  viewerRole: 'BUYER' | 'SELLER' | 'ADMIN',
) => {
  if (order.paymentMethod === 'CARD_ONLINE') {
    if (order.paymentStatus === 'PAID') {
      return 'Payment confirmed through the B2bar online payment flow.';
    }

    if (order.paymentStatus === 'FAILED') {
      return viewerRole === 'SELLER'
        ? 'The buyer can retry the payment.'
        : 'The online card payment was not completed.';
    }

    if (order.paymentStatus === 'AWAITING_PAYMENT') {
      return viewerRole === 'SELLER'
        ? 'The buyer has not completed the online payment yet.'
        : 'Your order has been created, but payment is still awaiting confirmation.';
    }
  }

  if (viewerRole === 'SELLER' && order.paymentStatus === 'AWAITING_PAYMENT') {
    return 'Complete the offline order after you receive payment directly from the buyer.';
  }

  return 'The payment status shown here is the authoritative status for this order.';
};

const BuyerOrderPaymentCard = ({
  order,
  viewerRole,
  onContinuePayment,
  isPaymentActionPending = false,
}: BuyerOrderPaymentCardProps) => {
  const canContinue = canRetryOnlinePayment(order) && viewerRole === 'BUYER';

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Payment</h2>
      </div>

      <div className={styles.paymentCardGrid}>
        <div className={styles.headerInfoItem}>
          <span className={styles.inlineLabel}>Method</span>
          <strong>{formatPaymentMethod(order.paymentMethod)}</strong>
        </div>
        <div className={styles.headerInfoItem}>
          <span className={styles.inlineLabel}>Status</span>
          <span
            className={`${styles.statusBadge} ${
              styles[`payment${order.paymentStatus}`]
            }`}
          >
            {formatPaymentStatus(order.paymentStatus)}
          </span>
        </div>
      </div>

      <p className={styles.paymentNote}>
        {getPaymentNote(order, viewerRole)}
      </p>

      {canContinue ? (
        <div className={styles.paymentActions}>
          <Button
            type='button'
            onClick={onContinuePayment}
            isLoading={isPaymentActionPending}
          >
            {order.paymentStatus === 'FAILED'
              ? 'Retry payment'
              : 'Continue payment'}
          </Button>
        </div>
      ) : null}
    </section>
  );
};

export { BuyerOrderPaymentCard };
