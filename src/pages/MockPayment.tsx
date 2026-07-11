import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import {
  useCompleteDemoPayment,
  useFailDemoPayment,
} from '@/hooks/usePayments';
import { useToast } from '@/hooks/useToast';
import {
  formatPaymentMethod,
  formatPaymentStatus,
} from '@/features/account/orders/model/orderDisplay';
import {
  getPaymentBatchContext,
  updatePaymentBatchStatus,
} from '@/utils/checkoutSuccessStorage';
import { extractErrorMessage } from '@/utils/error';

import styles from './PaymentFlow.module.css';

const formatBatchAmount = (amount?: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const getStatusClassName = (status?: string) => {
  switch (status) {
    case 'PAID':
      return styles.statusPaid;
    case 'FAILED':
      return styles.statusFailed;
    case 'REFUNDED':
      return styles.statusRefunded;
    default:
      return styles.statusAwaiting;
  }
};

const MockPayment = () => {
  const navigate = useNavigate();
  const { batchId } = useParams();
  const { showToast } = useToast();
  const successMutation = useCompleteDemoPayment(batchId);
  const failMutation = useFailDemoPayment(batchId);
  const batch = getPaymentBatchContext(batchId);

  const handleSuccess = async () => {
    if (!batchId) return;

    try {
      await successMutation.mutateAsync();
      updatePaymentBatchStatus(batchId, 'PAID');
      navigate(`/payment/success?batchId=${batchId}`);
    } catch (error) {
      showToast(
        extractErrorMessage(error, 'Unable to process the demo payment.'),
        'error',
      );
    }
  };

  const handleFailure = async () => {
    if (!batchId) return;

    try {
      await failMutation.mutateAsync();
      updatePaymentBatchStatus(batchId, 'FAILED');
      navigate(`/payment/failed?batchId=${batchId}`);
    } catch (error) {
      showToast(
        extractErrorMessage(error, 'Unable to process the demo payment.'),
        'error',
      );
    }
  };

  if (!batchId) {
    return (
      <main className={`container ${styles.page}`}>
        <div className={styles.stateCard}>
          <h1>Payment page not found</h1>
          <p>The demo payment batch identifier is missing.</p>
          <div className={styles.stateActions}>
            <Link to='/account?tab=orders'>
              <Button>View orders</Button>
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
          <h1>Preparing secure payment...</h1>
          <p>
            The demo payment details are not available in the current session.
            Restart the payment from your order details.
          </p>
          <div className={styles.stateActions}>
            <Link to='/account?tab=orders'>
              <Button variant='secondary'>View orders</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isBusy = successMutation.isPending || failMutation.isPending;

  if (batch.paymentStatus === 'PAID') {
    return (
      <main className={`container ${styles.page}`}>
        <div className={styles.stateCard}>
          <h1>Payment already completed</h1>
          <p>The order payment for this batch has already been confirmed.</p>
          <div className={styles.stateActions}>
            <Link to={`/payment/success?batchId=${batchId}`}>
              <Button>View payment status</Button>
            </Link>
            <Link to='/account?tab=orders'>
              <Button variant='secondary'>View orders</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`container ${styles.page}`}>
      <section className={styles.card}>
        <div>
          <div className={styles.eyebrowRow}>
            <p className={styles.eyebrow}>B2bar Secure Payment Environment</p>
            <span className={styles.badge}>Test Mode</span>
          </div>
          <h1 className={styles.title}>Secure Demo Payment</h1>
          <p className={styles.description}>
            This page simulates an online payment flow for demonstration
            purposes. No real money will be charged.
          </p>
        </div>

        <div className={styles.totalCard}>
          <p className={styles.totalLabel}>Order total</p>
          <p className={styles.totalValue}>
            {formatBatchAmount(batch.totalAmount, batch.currency || 'USD')}
          </p>
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Payment method</span>
            <span className={styles.metaValue}>
              {batch.paymentMethod
                ? formatPaymentMethod(batch.paymentMethod)
                : 'Online card payment'}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Orders</span>
            <span className={styles.metaValue}>
              {batch.orderNumbers.length || '—'}
            </span>
          </div>
        </div>

        <div className={styles.statusRow}>
          <span className={styles.metaLabel}>Current status</span>
          <span
            className={`${styles.statusBadge} ${getStatusClassName(
              batch.paymentStatus,
            )}`}
          >
            {formatPaymentStatus(batch.paymentStatus)}
          </span>
        </div>

        <div className={styles.actions}>
          <Button
            type='button'
            onClick={handleSuccess}
            isLoading={successMutation.isPending}
            disabled={isBusy}
          >
            Simulate Successful Payment
          </Button>
          <Button
            type='button'
            variant='secondary'
            onClick={handleFailure}
            isLoading={failMutation.isPending}
            disabled={isBusy}
          >
            Simulate Failed Payment
          </Button>
        </div>
      </section>
    </main>
  );
};

export default MockPayment;
