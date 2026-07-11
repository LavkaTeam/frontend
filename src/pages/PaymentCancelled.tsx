import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useCreateDemoPaymentSession } from '@/hooks/usePayments';
import { useToast } from '@/hooks/useToast';
import { extractErrorMessage } from '@/utils/error';

import styles from './PaymentFlow.module.css';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const batchId = searchParams.get('batchId') || undefined;
  const createSessionMutation = useCreateDemoPaymentSession();

  const handleContinue = async () => {
    if (!batchId) return;

    try {
      const session = await createSessionMutation.mutateAsync(batchId);
      window.location.assign(session.checkoutUrl);
    } catch (error) {
      showToast(
        extractErrorMessage(
          error,
          'Unable to continue the demo payment right now.',
        ),
        'error',
      );
    }
  };

  return (
    <main className={`container ${styles.page}`}>
      <div className={styles.stateCard}>
        <h1>Payment was not completed</h1>
        <p>
          Your order has been created, but online payment is still awaiting
          confirmation.
        </p>
        <div className={styles.stateActions}>
          {batchId ? (
            <Button
              type='button'
              onClick={handleContinue}
              isLoading={createSessionMutation.isPending}
            >
              Continue payment
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

export default PaymentCancelled;
