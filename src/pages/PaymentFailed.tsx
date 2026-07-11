import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useCreateDemoPaymentSession } from '@/hooks/usePayments';
import { useToast } from '@/hooks/useToast';
import { extractErrorMessage } from '@/utils/error';

import styles from './PaymentFlow.module.css';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const batchId = searchParams.get('batchId') || undefined;
  const createSessionMutation = useCreateDemoPaymentSession();

  const handleRetry = async () => {
    if (!batchId) return;

    try {
      const session = await createSessionMutation.mutateAsync(batchId);
      window.location.assign(session.checkoutUrl);
    } catch (error) {
      showToast(
        extractErrorMessage(
          error,
          'Unable to create a new demo payment session right now.',
        ),
        'error',
      );
    }
  };

  return (
    <main className={`container ${styles.page}`}>
      <div className={styles.stateCard}>
        <h1>Payment failed</h1>
        <p>The demo payment was not completed.</p>
        <div className={styles.stateActions}>
          {batchId ? (
            <Button
              type='button'
              onClick={handleRetry}
              isLoading={createSessionMutation.isPending}
            >
              Try again
            </Button>
          ) : null}
          <Link to='/account?tab=orders'>
            <Button variant='secondary'>View orders</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentFailed;
