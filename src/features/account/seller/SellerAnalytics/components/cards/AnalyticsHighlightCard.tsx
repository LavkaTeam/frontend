import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

import type { AnalyticsHighlightViewModel } from '../../model/analytics.utils';

import styles from './AnalyticsHighlightCard.module.css';

interface AnalyticsHighlightCardProps {
  item: AnalyticsHighlightViewModel;
}

const AnalyticsHighlightCard = ({ item }: AnalyticsHighlightCardProps) => (
  <article
    className={`${styles.card} ${
      item.accent === 'green' ? styles.cardGreen : styles.cardOrange
    }`}
  >
    <div className={styles.header}>
      <p className={styles.label}>{item.label}</p>
      <p
        className={`${styles.value} ${
          item.accent === 'green' ? styles.valueGreen : styles.valueOrange
        }`}
      >
        <AnimatedNumber
          value={item.numericValue}
          formatter={item.formatValue}
          precision={item.id === 'averageOrderValue' ? 'tenth' : 'integer'}
        />
      </p>
    </div>
    <p className={styles.description}>{item.description}</p>
  </article>
);

export { AnalyticsHighlightCard };
