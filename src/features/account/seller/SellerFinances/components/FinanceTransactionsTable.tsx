import { Link } from 'react-router-dom';

import { Skeleton } from '@/components/ui/Skeleton';
import type { TransactionResponseDto } from '../model/finance.types';

import {
  getFinanceTransactionStatusMeta,
  NEGATIVE_TRANSACTION_TYPES,
} from '../config/financeDisplay';
import {
  formatFinanceAmount,
  formatFinanceDate,
  getTransactionSubtitle,
  getTransactionTitle,
} from '../utils/financeFormatters';
import styles from './FinanceTransactionsTable.module.css';

interface FinanceTransactionsTableProps {
  transactions: TransactionResponseDto[];
  isLoading: boolean;
  totalItems: number;
  onTransactionClick: (transactionId: string) => void;
}

const FinanceTransactionsTable = ({
  transactions,
  isLoading,
  totalItems,
  onTransactionClick,
}: FinanceTransactionsTableProps) => {
  const sortedTransactions = [...transactions].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  if (isLoading) {
    return (
      <div className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <Skeleton width={128} height={24} radius={8} />
          <div className={styles.historyColumns}>
            <Skeleton width={84} height={24} radius={8} />
            <Skeleton width={76} height={24} radius={8} />
            <Skeleton width={84} height={24} radius={8} />
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={styles.skeletonRow}>
            <div className={styles.skeletonInfoCell}>
              <Skeleton width={96} height={20} radius={6} />
              <Skeleton width={148} height={18} radius={6} />
            </div>
            <Skeleton width={116} height={20} radius={6} />
            <Skeleton width={122} height={26} radius='8px 0 0 8px' />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.historyCard}>
      <div className={styles.historyHeader}>
        <div className={styles.historyTitleRow}>
          <p className={styles.historyTitle}>Transactions</p>
          <span className={styles.historyCount}>
            {totalItems} result{totalItems === 1 ? '' : 's'}
          </span>
        </div>
        <div className={styles.historyColumns}>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
      </div>

      <div className={styles.historyRows}>
        {sortedTransactions.length === 0 ? (
          <div className={styles.emptyState}>
            <h4>No transactions found</h4>
            <p>Try another date range or status filter.</p>
          </div>
        ) : (
          sortedTransactions.map((transaction) => {
            const isNegative = NEGATIVE_TRANSACTION_TYPES.has(
              transaction.type,
            );
            const statusMeta = getFinanceTransactionStatusMeta(transaction);
            const orderLink = `/account?tab=orders&scope=sales&orderId=${transaction.orderId}`;
            const primaryLabel = getTransactionTitle(transaction);
            const secondaryLabel = getTransactionSubtitle(transaction);

            return (
              <button
                key={transaction.id}
                className={styles.transactionRowButton}
                onClick={() => onTransactionClick(transaction.id)}
                type='button'
              >
                <div className={styles.transactionRow}>
                <div className={styles.dateCell}>
                  <span>{formatFinanceDate(transaction.createdAt)}</span>
                  <span className={styles.transactionType}>{primaryLabel}</span>
                  {secondaryLabel !== primaryLabel ? (
                    <span className={styles.transactionMeta}>
                      {transaction.orderId ? (
                        <Link
                          to={orderLink}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {secondaryLabel}
                        </Link>
                      ) : (
                        secondaryLabel
                      )}
                    </span>
                  ) : null}
                </div>
                <span
                  className={`${styles.amountCell} ${
                    isNegative ? styles.negativeAmount : styles.positiveAmount
                  }`}
                >
                  {formatFinanceAmount(transaction.amount, {
                    withSign: true,
                    type: transaction.type,
                  })}
                </span>
                <span
                  className={`${styles.statusBadge} ${
                    styles[statusMeta.tone]
                  }`}
                >
                  {statusMeta.label}
                </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export { FinanceTransactionsTable };
