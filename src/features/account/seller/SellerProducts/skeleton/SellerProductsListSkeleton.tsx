import { Skeleton } from '@/components/ui/Skeleton';

import styles from './SellerProductsPageSkeleton.module.css';

const SellerProductsListSkeleton = () => (
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
          <div className={styles.productCell}>
            <Skeleton width={56} height={56} radius={12} />
            <div className={styles.productInfo}>
              <Skeleton width='82%' height={22} radius={6} />
              <Skeleton width='54%' height={18} radius={6} />
            </div>
          </div>
          <div className={styles.cell}>
            <Skeleton width='72%' height={18} radius={6} />
          </div>
          <div className={styles.cell}>
            <Skeleton width='44%' height={18} radius={6} />
          </div>
          <div className={styles.cell}>
            <Skeleton width='58%' height={18} radius={6} />
          </div>
          <div className={styles.cell}>
            <Skeleton width={128} height={30} radius='8px 0 0 8px' />
          </div>
          <div className={styles.cell}>
            <Skeleton width={32} height={32} radius={4} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export { SellerProductsListSkeleton };
