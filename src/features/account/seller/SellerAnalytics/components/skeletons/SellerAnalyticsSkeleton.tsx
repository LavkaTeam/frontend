import { Skeleton } from '@/components/ui/Skeleton';

import styles from '../../SellerAnalytics.module.css';

const SellerAnalyticsSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <Skeleton width={172} height={44} radius={8} />
      <Skeleton width={360} height={20} radius={8} />
    </div>

    <div className={styles.metricsGrid}>
      {[0, 1, 2].map((index) => (
        <div key={index} className={styles.metricCard}>
          <Skeleton width={148} height={18} radius={6} />
          <Skeleton width={index === 0 ? 126 : 168} height={72} radius={10} />
          <div className={styles.metricSkeletonFooter}>
            <Skeleton width={118} height={18} radius={6} />
            <Skeleton width={20} height={20} radius={999} />
          </div>
        </div>
      ))}
    </div>

    <div className={styles.statsGrid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={styles.statCard}>
          <Skeleton width={64} height={60} radius={8} />
          <Skeleton width={78} height={18} radius={6} />
        </div>
      ))}
    </div>

    <div className={styles.overviewGrid}>
      <div className={styles.categorySkeletonCard}>
        <Skeleton width={214} height={32} radius={8} />
        <div className={styles.categorySkeletonContent}>
          <div className={styles.categorySkeletonDonut}>
            <Skeleton width={220} height={220} radius='50%' />
          </div>
          <div className={styles.categorySkeletonLegend}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={styles.categorySkeletonRow}>
                <div className={styles.categorySkeletonItem}>
                  <Skeleton width={10} height={10} radius={999} />
                  <Skeleton width={index % 2 === 0 ? 104 : 132} height={18} radius={6} />
                </div>
                <Skeleton width={42} height={18} radius={6} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.overviewSidebar}>
        <div className={styles.highlightsGrid}>
          <div className={styles.highlightSkeletonCard}>
            <div className={styles.highlightSkeletonColumn}>
              <Skeleton width={160} height={18} radius={6} />
              <Skeleton width={168} height={52} radius={10} />
            </div>
            <Skeleton width='100%' height={18} radius={6} />
          </div>
        </div>

        <div className={styles.statsOverflowGrid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.statCard}>
              <Skeleton width={64} height={60} radius={8} />
              <Skeleton width={78} height={18} radius={6} />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleBlock}>
          <Skeleton width={150} height={28} radius={8} />
          <Skeleton width={144} height={44} radius={8} />
        </div>
        <Skeleton width={112} height={36} radius={10} />
      </div>

      <div className={styles.chartBars}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className={styles.chartColumn}>
            <div className={styles.chartColumnBars}>
              <Skeleton
                className={styles.chartSkeletonBar}
                height={`${28 + ((index * 11) % 42)}%`}
                radius={13}
              />
              <Skeleton
                className={styles.chartSkeletonBar}
                height={`${34 + ((index * 13) % 46)}%`}
                radius={13}
              />
            </div>
            <Skeleton width={34} height={18} radius={6} />
          </div>
        ))}
      </div>
    </div>

  </div>
);

export { SellerAnalyticsSkeleton };
