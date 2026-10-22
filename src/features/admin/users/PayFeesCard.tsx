import { useId, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useAdminPayFees } from '@/hooks/useAdmin';

import { formatMoney } from '../model/adminDisplay';
import {
  getAdminActionError,
  useAdminFeedback,
} from '../model/useAdminFeedback';
import { AdminDialog } from '../shared/AdminDialog/AdminDialog';

import styles from './AdminUserDetails.module.css';

interface PayFeesCardProps {
  sellerId: string;
  companyLabel: string;
}

// Records platform fees the seller paid outside the system
// (POST /admin/finances/sellers/{id}/pay-fees). The backend rejects amounts
// above the fees due; the admin API does not expose the due amount upfront.
const PayFeesCard = ({ sellerId, companyLabel }: PayFeesCardProps) => {
  const inputId = useId();
  const payFees = useAdminPayFees(sellerId);
  const notify = useAdminFeedback();
  const [amount, setAmount] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [dueAfter, setDueAfter] = useState<number | null>(null);

  const value = Number(amount);
  const isValid = amount !== '' && Number.isFinite(value) && value > 0;

  const handleConfirm = () =>
    payFees.mutate(Math.round(value * 100) / 100, {
      onSuccess: (response) => {
        setIsConfirming(false);
        setAmount('');
        setDueAfter(response.platformFeesDueAfter);
        notify(`Fee payment of ${formatMoney(response.amount)} recorded.`);
      },
      onError: (mutationError) => setError(getAdminActionError(mutationError)),
    });

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Platform fees</h2>
      <p className={styles.muted}>
        Record a fee payment the seller made outside the platform. It reduces
        the fees the seller owes.
      </p>

      <form
        className={styles.feesForm}
        onSubmit={(event) => {
          event.preventDefault();
          if (!isValid) return;
          setError('');
          setIsConfirming(true);
        }}
      >
        <div className={styles.feesField}>
          <Label htmlFor={inputId}>Amount, USD</Label>
          <Input
            id={inputId}
            type='number'
            inputMode='decimal'
            min='0.01'
            step='0.01'
            value={amount}
            placeholder='0.00'
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <Button type='submit' variant='secondary' disabled={!isValid}>
          Record payment
        </Button>
      </form>

      {dueAfter !== null ? (
        <p className={styles.muted}>
          Fees still due after the last payment:{' '}
          <strong>{formatMoney(dueAfter)}</strong>
        </p>
      ) : null}

      <AdminDialog
        isOpen={isConfirming}
        icon='email'
        title={`Record ${isValid ? formatMoney(value) : ''} from ${companyLabel}?`}
        description='Only record money you have actually received. The action is logged.'
        confirmLabel='Record payment'
        isBusy={payFees.isPending}
        error={error}
        onConfirm={handleConfirm}
        onClose={() => setIsConfirming(false)}
      />
    </section>
  );
};

export { PayFeesCard };
