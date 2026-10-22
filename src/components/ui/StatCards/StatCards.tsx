import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/Skeleton';

import styles from './StatCards.module.css';

export type CardAccent = 'burgundy' | 'green' | 'orange';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  accent: CardAccent;
  // Line under the number, e.g. a trend or a link.
  footer?: ReactNode;
}

// Large card with a coloured border and a big number, as in the seller
// analytics ("Total revenue", "Net profit").
const MetricCard = ({ label, value, accent, footer }: MetricCardProps) => (
  <article className={`${styles.metricCard} ${styles[accent]}`}>
    <p className={styles.metricLabel}>{label}</p>
    <div className={`${styles.metricValue} ${styles[`${accent}Text`]}`}>
      {value}
    </div>
    {footer ? <div className={styles.metricFooter}>{footer}</div> : null}
  </article>
);

interface StatCardProps {
  label: string;
  value: ReactNode;
  accent: CardAccent;
}

// Compact card with a number and a caption.
const StatCard = ({ label, value, accent }: StatCardProps) => (
  <article className={`${styles.statCard} ${styles[accent]}`}>
    <div className={`${styles.statValue} ${styles[`${accent}Text`]}`}>
      {value}
    </div>
    <p className={styles.statLabel}>{label}</p>
  </article>
);

// Placeholders with the same geometry, shown while the numbers load.
const MetricCardSkeleton = () => (
  <div className={styles.metricCard}>
    <Skeleton width={148} height={18} radius={6} />
    <Skeleton
      className={styles.skeletonValue}
      width={126}
      height={72}
      radius={10}
    />
    <div className={styles.metricFooter}>
      <Skeleton width={118} height={18} radius={6} />
      <Skeleton width={20} height={20} radius={999} />
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className={styles.statCard}>
    <Skeleton width={64} height={60} radius={8} />
    <Skeleton width={78} height={18} radius={6} />
  </div>
);

export { MetricCard, MetricCardSkeleton, StatCard, StatCardSkeleton };
