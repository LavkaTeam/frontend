import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { CheckoutSuccess } from '@/components/CheckoutSuccess';
import { Button } from '@/components/ui/Button';
import { useCreateDemoPaymentSession } from '@/hooks/usePayments';
import { useToast } from '@/hooks/useToast';
import { formatPaymentStatus } from '@/features/account/orders/model/orderDisplay';
import {
  getCheckoutSuccessOrders,
  getPaymentBatchContext,
} from '@/utils/checkoutSuccessStorage';
import { extractErrorMessage } from '@/utils/error';

import styles from './PaymentFlow.module.css';

const formatBatchAmount = (amount?: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const batchId = searchParams.get('batchId') || undefined;
  const source = searchParams.get('source');
  const createSessionMutation = useCreateDemoPaymentSession();
  const checkoutOrders = useMemo(() => getCheckoutSuccessOrders(), []);
  const batch = getPaymentBatchContext(batchId);

  const handleContinuePayment = async () => {
    if (!batchId) return;

    try {
      const session = await createSessionMutation.mutateAsync(batchId);
      window.location.assign(session.checkoutUrl);
    } catch (error) {
      showToast(
        extractErrorMessage(
          error,
          'Unable to continue the online payment right now.',
        ),
        'error',
      );
    }
  };

  if (source === 'checkout' && checkoutOrders.length > 0 && !batchId) {
    return (
      <main className={`container ${styles.page}`}>
        <CheckoutSuccess orders={checkoutOrders} />
      </main>
    );
  }

  if (!batchId) {
    return (
      <main className={`container ${styles.page}`}>
        <div className={styles.stateCard}>
          <h1>Payment successful</h1>
          <p>Your order has been created successfully.</p>
          <div className={styles.stateActions}>
            <Link to='/account?tab=orders'>
              <Button>View orders</Button>
            </Link>
            <Link to='/products'>
              <Button variant='secondary'>Continue shopping</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!batch) {
    return (
      <main className={`container ${styles.page}`}>
        <div className={styles.stateCard}>
          <h1>Payment status unavailable</h1>
          <p>
            Please open your orders to verify the latest payment state.
          </p>
          <div className={styles.stateActions}>
            <Link to='/account?tab=orders'>
              <Button>View orders</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const title =
    batch.paymentStatus === 'PAID'
      ? 'Payment successful'
      : batch.paymentStatus === 'FAILED'
        ? 'Payment failed'
        : 'Payment is still being processed';
  const description =
    batch.paymentStatus === 'PAID'
      ? 'The online payment was confirmed and your orders were updated.'
      : batch.paymentStatus === 'FAILED'
        ? 'The online payment was not completed.'
        : 'Your order exists, but online payment is still awaiting confirmation.';

  return (
    <main className={`container ${styles.page}`}>
      <section className={styles.card}>
        <div className={styles.eyebrowRow}>
          <p className={styles.eyebrow}>B2bar Payment</p>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        <div className={styles.totalCard}>
          <p className={styles.totalLabel}>Batch total</p>
          <p className={styles.totalValue}>
            {formatBatchAmount(batch.totalAmount, batch.currency || 'USD')}
          </p>
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Status</span>
            <span className={styles.metaValue}>
              {formatPaymentStatus(batch.paymentStatus)}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Orders</span>
            <span className={styles.metaValue}>
              {batch.orderNumbers.length || '—'}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          {batch.paymentStatus !== 'PAID' ? (
            <Button
              type='button'
              onClick={handleContinuePayment}
              isLoading={createSessionMutation.isPending}
            >
              Continue payment
            </Button>
          ) : null}
          <Link className={styles.secondaryButton} to='/account?tab=orders'>
            <Button type='button' variant='secondary'>
              View orders
            </Button>
          </Link>
          <Link className={styles.secondaryButton} to='/products'>
            <Button type='button' variant='secondary'>
              Continue shopping
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PaymentSuccess;
