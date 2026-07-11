import { Skeleton } from '@/components/ui/Skeleton';

import styles from './SellerOrdersPageSkeleton.module.css';

const SellerOrdersListSkeleton = () => (
  <div className={styles.tableWrap}>
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <Skeleton height={18} radius={6} />
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
            <Skeleton width='76%' height={18} radius={6} />
          </div>
          <div className={styles.cell}>
            <Skeleton width={122} height={26} radius={4} />
          </div>
          <div className={styles.cell}>
            <Skeleton width={74} height={18} radius={6} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export { SellerOrdersListSkeleton };
