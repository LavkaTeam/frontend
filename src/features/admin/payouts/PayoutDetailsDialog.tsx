import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { AdminPayout } from '@/types/admin';

import {
  formatDateTime,
  formatIban,
  formatMoney,
  PAYOUT_STATUS,
} from '../model/adminDisplay';
import { AdminDialog } from '../shared/AdminDialog/AdminDialog';

import styles from './PayoutDetailsDialog.module.css';

interface PayoutDetailsDialogProps {
  payout: AdminPayout | null;
  isBusy: boolean;
  error: string;
  onApprove: () => void;
  onReject: () => void;
  onCopy: (label: string, value?: string) => void;
  onClose: () => void;
}

interface DetailRowProps {
  label: string;
  value?: string;
  mono?: boolean;
  onCopy?: () => void;
}

const DetailRow = ({ label, value, mono = false, onCopy }: DetailRowProps) => (
  <div className={styles.row}>
    <dt>{label}</dt>
    <dd className={mono ? styles.mono : undefined}>{value || '—'}</dd>
    {onCopy && value ? (
      <button type='button' className={styles.copy} onClick={onCopy}>
        Copy
      </button>
    ) : null}
  </div>
);

// Everything about one payout request: who gets the money, where to send it
// and the decision. The table keeps only the summary.
const PayoutDetailsDialog = ({
  payout,
  isBusy,
  error,
  onApprove,
  onReject,
  onCopy,
  onClose,
}: PayoutDetailsDialogProps) => {
  const isPending = payout?.status === 'PENDING';
  const status = payout ? PAYOUT_STATUS[payout.status] : null;

  return (
    <AdminDialog
      isOpen={Boolean(payout)}
      icon={
        isPending
          ? 'pending'
          : payout?.status === 'COMPLETED'
            ? 'success'
            : 'error'
      }
      title={
        payout ? `Payout of ${formatMoney(payout.amount, payout.currency)}` : ''
      }
      description={
        isPending
          ? 'Make the bank transfer first: the platform does not send money. Then mark the request as paid.'
          : undefined
      }
      confirmLabel='Mark as paid'
      cancelLabel='Close'
      hideConfirm={!isPending}
      isBusy={isBusy}
      error={error}
      onConfirm={onApprove}
      onClose={onClose}
      extraActions={
        isPending ? (
          <Button
            type='button'
            variant='secondary'
            onClick={onReject}
            disabled={isBusy}
          >
            Reject
          </Button>
        ) : null
      }
    >
      {payout && status ? (
        <div className={styles.content}>
          <section className={styles.block}>
            <h4 className={styles.blockTitle}>Request</h4>
            <dl className={styles.list}>
              <DetailRow
                label='Seller'
                value={payout.sellerCompany || payout.sellerName}
              />
              <DetailRow label='Email' value={payout.sellerEmail} />
              <div className={styles.row}>
                <dt>Status</dt>
                <dd>
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                </dd>
              </div>
              <DetailRow
                label='Requested'
                value={formatDateTime(payout.createdAt)}
              />
              {payout.processedAt ? (
                <DetailRow
                  label='Processed'
                  value={formatDateTime(payout.processedAt)}
                />
              ) : null}
            </dl>
            <Link
              to={`/admin/users/${payout.sellerId}`}
              className={styles.link}
            >
              Open the seller →
            </Link>
          </section>

          <section className={styles.block}>
            <h4 className={styles.blockTitle}>Transfer to</h4>
            <dl className={styles.list}>
              <DetailRow label='Bank' value={payout.bankName} />
              <DetailRow
                label='IBAN'
                value={payout.iban ? formatIban(payout.iban) : undefined}
                mono
                onCopy={() => onCopy('IBAN', payout.iban)}
              />
              <DetailRow
                label='BIC'
                value={payout.bic}
                mono
                onCopy={() => onCopy('BIC', payout.bic)}
              />
            </dl>
            <p className={styles.note}>
              Bank details as the seller had them when requesting the payout.
            </p>
          </section>

          {payout.adminComment ? (
            <section className={styles.block}>
              <h4 className={styles.blockTitle}>Comment sent to the seller</h4>
              <p className={styles.comment}>{payout.adminComment}</p>
            </section>
          ) : null}
        </div>
      ) : null}
    </AdminDialog>
  );
};

export { PayoutDetailsDialog };
