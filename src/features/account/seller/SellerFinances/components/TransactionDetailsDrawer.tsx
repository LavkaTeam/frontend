import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import type { Address } from '@/types/user';
import type { TransactionDetailsDto } from '../model/finance.types';

import { getFinanceTransactionStatusMeta } from '../config/financeDisplay';
import {
  formatFinanceAmount,
  formatFinanceDate,
  getTransactionTitle,
} from '../utils/financeFormatters';
import { TransactionDetailsDrawerSkeleton } from './TransactionDetailsDrawerSkeleton';
import styles from './TransactionDetailsDrawer.module.css';

interface TransactionDetailsDrawerProps {
  transaction?: TransactionDetailsDto;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const DrawerRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className={styles.drawerRow}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const formatAddress = (address?: Address | null) => {
  if (!address) return 'Not specified';

  const parts = [
    address.country,
    address.city,
    address.street,
    address.zipCode,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'Not specified';
};

const TransactionDetailsDrawer = ({
  transaction,
  isLoading,
  isOpen,
  onClose,
}: TransactionDetailsDrawerProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const statusMeta = transaction
    ? getFinanceTransactionStatusMeta(transaction)
    : null;
  const orderLink =
    transaction?.orderId
      ? `/account?tab=orders&scope=sales&orderId=${transaction.orderId}`
      : null;

  return (
    <>
      <div
        className={`${styles.drawerOverlay} ${isOpen ? styles.drawerOverlayOpen : ''}`}
        onClick={onClose}
      />

      <aside className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <div>
            <h3 className={styles.drawerTitle}>Transaction details</h3>
            {transaction ? (
              <p className={styles.drawerSubtitle}>
                {getTransactionTitle(transaction)}
              </p>
            ) : null}
          </div>
          <button
            type='button'
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close transaction details'
          >
            ×
          </button>
        </div>

        <div className={styles.drawerContent}>
          {isLoading || !transaction ? (
            <TransactionDetailsDrawerSkeleton />
          ) : (
            <>
              <div className={styles.drawerSection}>
                <DrawerRow
                  label='Amount'
                  value={formatFinanceAmount(transaction.amount, {
                    type: transaction.type,
                  })}
                />
                <DrawerRow label='Date' value={formatFinanceDate(transaction.createdAt)} />
                <DrawerRow label='Type' value={getTransactionTitle(transaction)} />
                <div className={styles.drawerRow}>
                  <span>Order number</span>
                  {orderLink && transaction.orderNumber ? (
                    <Link
                      to={orderLink}
                      className={styles.drawerOrderLink}
                      onClick={onClose}
                    >
                      {transaction.orderNumber}
                    </Link>
                  ) : (
                    <strong>{transaction.orderNumber || 'Not specified'}</strong>
                  )}
                </div>
                <div className={styles.drawerRow}>
                  <span>Status</span>
                  <span
                    className={`${styles.statusBadge} ${styles[statusMeta?.tone || 'neutral']}`}
                  >
                    {statusMeta?.label || 'Unknown'}
                  </span>
                </div>
              </div>

              {(transaction.type === 'ORDER_REVENUE' ||
                transaction.type === 'PLATFORM_FEE') && (
                <div className={styles.drawerSection}>
                  <DrawerRow
                    label='Buyer'
                    value={transaction.buyerName || 'Not specified'}
                  />
                  <DrawerRow
                    label='Company'
                    value={transaction.buyerCompany || 'Not specified'}
                  />
                  <DrawerRow
                    label='Email'
                    value={transaction.buyerEmail || 'Not specified'}
                  />
                  <DrawerRow
                    label='Phone'
                    value={transaction.buyerPhone || 'Not specified'}
                  />
                  <DrawerRow
                    label='Legal address'
                    value={formatAddress(transaction.buyerLegalAddress)}
                  />
                  {orderLink ? (
                    <Link to={orderLink} className={styles.drawerLink} onClick={onClose}>
                      View order
                    </Link>
                  ) : null}
                </div>
              )}

              {transaction.type === 'PAYOUT' && (
                <div className={styles.drawerSection}>
                  <DrawerRow
                    label='IBAN'
                    value={(transaction.iban || 'Not specified').toUpperCase()}
                  />
                  <DrawerRow
                    label='Bank'
                    value={transaction.bankName || 'Not specified'}
                  />
                  {transaction.adminComment ? (
                    <div className={styles.drawerNote}>
                      <span>Admin comment</span>
                      <p>{transaction.adminComment}</p>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export { TransactionDetailsDrawer };
