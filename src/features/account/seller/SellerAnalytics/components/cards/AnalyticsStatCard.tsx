import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

import type { AnalyticsStatViewModel } from '../../model/analytics.utils';

import styles from '../../SellerAnalytics.module.css';

interface AnalyticsStatCardProps {
  stat: AnalyticsStatViewModel;
}

const AnalyticsStatCard = ({ stat }: AnalyticsStatCardProps) => (
  <article
    className={`${styles.statCard} ${
      stat.accent === 'green'
        ? styles.statCardGreen
        : stat.accent === 'burgundy'
          ? styles.statCardBurgundy
          : styles.statCardOrange
    }`}
  >
    <p
      className={`${styles.statValue} ${
        stat.accent === 'green'
          ? styles.statValueGreen
          : stat.accent === 'burgundy'
            ? styles.statValueBurgundy
            : styles.statValueOrange
      }`}
    >
      <AnimatedNumber
        value={stat.numericValue}
        formatter={stat.formatValue}
        precision='integer'
      />
    </p>
    <p className={styles.statLabel}>{stat.label}</p>
  </article>
);

export { AnalyticsStatCard };
