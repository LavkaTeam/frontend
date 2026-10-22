import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { MetricCard } from '@/components/ui/StatCards';

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
  <MetricCard
    label={metric.label}
    // 'neutral' in the analytics model is the brand burgundy.
    accent={metric.accent === 'neutral' ? 'burgundy' : metric.accent}
    value={
      <AnimatedNumber
        value={metric.numericValue}
        formatter={metric.formatValue}
        precision={
          metric.id === 'totalRevenue' || metric.id === 'netProfit'
            ? 'tenth'
            : 'integer'
        }
      />
    }
    footer={
      <>
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
      </>
    }
  />
);

export { AnalyticsMetricCard };
