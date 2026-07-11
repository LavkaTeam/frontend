import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

import type { AnalyticsMetricViewModel } from '../../model/analytics.utils';

import styles from '../../SellerAnalytics.module.css';

const TrendArrow = ({
  direction,
}: {
  direction: AnalyticsMetricViewModel['trendDirection'];
}) => {
  if (direction === 'neutral') {
    return <span className={styles.trendDash} aria-hidden='true' />;
  }

  return (
    <svg
      className={`${styles.trendArrow} ${
        direction === 'down' ? styles.trendArrowDown : ''
      }`}
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M10 15V5M10 5L5.5 9.5M10 5L14.5 9.5'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

interface AnalyticsMetricCardProps {
  metric: AnalyticsMetricViewModel;
}

const AnalyticsMetricCard = ({ metric }: AnalyticsMetricCardProps) => (
  <article
    className={`${styles.metricCard} ${styles[`metricCard${metric.accent[0].toUpperCase()}${metric.accent.slice(1)}`]}`}
  >
    <p className={styles.metricLabel}>{metric.label}</p>
    <p
      className={`${styles.metricValue} ${styles[`metricValue${metric.accent[0].toUpperCase()}${metric.accent.slice(1)}`]}`}
    >
      <AnimatedNumber
        value={metric.numericValue}
        formatter={metric.formatValue}
        precision={metric.id === 'totalRevenue' || metric.id === 'netProfit' ? 'tenth' : 'integer'}
      />
    </p>
    <div className={styles.metricTrendRow}>
      <p className={styles.metricTrendText}>
        <span
          className={`${styles.metricTrendValue} ${
            metric.trendDirection === 'down'
              ? styles.metricTrendValueDown
              : styles.metricTrendValueUp
          }`}
        >
          {metric.trendValue}
        </span>{' '}
        {metric.trendLabel}
      </p>
      <span
        className={`${styles.metricTrendIcon} ${
          metric.trendDirection === 'down'
            ? styles.metricTrendIconDown
            : styles.metricTrendIconUp
        }`}
      >
        <TrendArrow direction={metric.trendDirection} />
      </span>
    </div>
  </article>
);

export { AnalyticsMetricCard };
