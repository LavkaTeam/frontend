import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import type { FinanceSummaryDto } from '../model/finance.types';

import {
  formatFinanceAmount,
  getFinanceSummaryValue,
} from '../utils/financeFormatters';
import styles from './FinanceSummaryCards.module.css';

interface FinanceSummaryCardsProps {
  summary?: FinanceSummaryDto;
  isLoading: boolean;
}

interface FinanceSummaryCard {
  label: string;
  value: number;
  className: string;
  description: string;
  action?: boolean;
}

const FinanceSummaryCards = ({
  summary,
  isLoading,
}: FinanceSummaryCardsProps) => {
  const { showToast } = useToast();
  const platformFeesDue = summary?.platformFeesDue ?? 0;
  const cards: FinanceSummaryCard[] = [
    {
      label: 'Available for payout',
      value: getFinanceSummaryValue(
        summary?.availableForPayout,
        summary?.availableBalance,
      ),
      className: styles.balanceAmount,
      description: 'Completed online payments',
    },
    {
      label: 'Pending payments',
      value: getFinanceSummaryValue(
        summary?.pendingPayments,
        summary?.expectedPayments,
      ),
      className: styles.expectedAmount,
      description: 'Orders awaiting payment',
    },
  ];

  if (isLoading || platformFeesDue > 0) {
    cards.push({
      label: 'Platform fees due',
      value: platformFeesDue,
      className: styles.feeAmount,
      description: 'Outstanding seller fees',
      action: true,
    });
  }

  return (
    <div className={styles.summaryColumn}>
      {cards.map((card) => (
        <div key={card.label} className={styles.summaryCard}>
          <p className={styles.summaryLabel}>{card.label}</p>
          {isLoading ? (
            <>
              <Skeleton width='100%' height={64} radius={10} />
              <Skeleton width='88%' height={20} radius={8} />
              <Skeleton width='72%' height={20} radius={8} />
            </>
          ) : (
            <>
              <p className={`${styles.summaryAmount} ${card.className}`}>
                <AnimatedNumber
                  value={card.value}
                  formatter={formatFinanceAmount}
                  precision='tenth'
                />
              </p>
              <p className={styles.summaryDescription}>{card.description}</p>
              {'action' in card ? (
                <button
                  type='button'
                  className={styles.payFeesButton}
                  onClick={() =>
                    showToast(
                      'Please contact support to arrange payment of your outstanding platform fees.',
                      'success',
                    )
                  }
                >
                  Pay fees
                </button>
              ) : null}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export { FinanceSummaryCards };
