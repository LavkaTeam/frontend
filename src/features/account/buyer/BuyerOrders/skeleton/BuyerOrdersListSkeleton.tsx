import { Skeleton } from '@/components/ui/Skeleton';

import styles from './BuyerOrdersPageSkeleton.module.css';

const BuyerOrdersListSkeleton = () => (
  <div className={styles.tableWrap}>
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <Skeleton height={18} radius={6} />
        <Skeleton height={18} radius={6} />
        <Skeleton height={18} radius={6} />
        <Skeleton height={18} radius={6} />
        <Skeleton height={18} radius={6} />
      </div>

      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.cell}>
            <Skeleton width='72%' height={18} radius={6} />
          </div>
          <div className={styles.cell}>
            <Skeleton width='68%' height={18} radius={6} />
          </div>
          <div className={styles.cell}>
            <Skeleton width='64%' height={18} radius={6} />
          </div>
          <div className={styles.cell}>
            <Skeleton width={122} height={28} radius={8} />
          </div>
          <div className={styles.cell}>
            <Skeleton width={74} height={18} radius={6} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export { BuyerOrdersListSkeleton };
