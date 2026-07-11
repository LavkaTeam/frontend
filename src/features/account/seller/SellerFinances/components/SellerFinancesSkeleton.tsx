import { Skeleton } from '@/components/ui/Skeleton';

import styles from './SellerFinancesSkeleton.module.css';

const SellerFinancesSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.headerRow}>
      <div className={styles.titleBlock}>
        <Skeleton width={172} height={44} radius={8} />
        <Skeleton width={440} height={28} radius={8} />
      </div>

      <div className={styles.actions}>
        <Skeleton width='100%' height={48} radius={8} />
        <div className={styles.downloadSkeleton}>
          <Skeleton width={20} height={20} radius={999} />
          <Skeleton width={158} height={24} radius={8} />
        </div>
      </div>
    </div>

    <div className={styles.contentGrid}>
      <div className={styles.summaryColumn}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={styles.summaryCard}>
            <Skeleton width={180} height={24} radius={8} />
            <Skeleton width='100%' height={64} radius={10} />
            <Skeleton width='88%' height={20} radius={8} />
            <Skeleton width='72%' height={20} radius={8} />
          </div>
        ))}
      </div>

      <div className={styles.historyColumn}>
        <div className={styles.filters}>
          <div className={styles.filterField}>
            <Skeleton width={60} height={20} radius={6} />
            <Skeleton width='100%' height={40} radius={8} />
          </div>

          <div className={styles.filterField}>
            <Skeleton width={74} height={20} radius={6} />
            <Skeleton width='100%' height={40} radius={8} />
          </div>

          <div className={styles.dateRangeField}>
            <div className={styles.filterField}>
              <Skeleton width={78} height={20} radius={6} />
              <Skeleton width='100%' height={40} radius={8} />
            </div>
            <Skeleton className={styles.dateDivider} width={18} height={18} radius={6} />
            <div className={styles.filterField}>
              <Skeleton width={42} height={20} radius={6} />
              <Skeleton width='100%' height={40} radius={8} />
            </div>
          </div>
        </div>

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
                <Skeleton width={146} height={18} radius={6} />
              </div>
              <Skeleton width={110} height={20} radius={6} />
              <Skeleton width={122} height={26} radius='8px 0 0 8px' />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export { SellerFinancesSkeleton };
