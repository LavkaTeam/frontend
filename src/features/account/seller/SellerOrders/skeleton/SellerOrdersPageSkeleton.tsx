import { Skeleton } from '@/components/ui/Skeleton';

import { SellerPaginationSkeleton } from '../../shared/SellerPaginationSkeleton';
import { SellerOrdersListSkeleton } from './SellerOrdersListSkeleton';
import { SellerOrdersToolbarSkeleton } from './SellerOrdersToolbarSkeleton';
import styles from './SellerOrdersPageSkeleton.module.css';

const SellerOrdersPageSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <Skeleton width={118} height={44} radius={8} />
      <Skeleton width={548} height={28} radius={8} />
    </div>

    <div className={styles.segmentedControl}>
      <div className={`${styles.segment} ${styles.segmentActive}`}>
        <Skeleton width={220} height={34} radius={8} />
        <Skeleton width={184} height={18} radius={8} />
      </div>
      <div className={styles.segment}>
        <Skeleton width={178} height={34} radius={8} />
        <Skeleton width={160} height={18} radius={8} />
      </div>
    </div>

    <SellerOrdersToolbarSkeleton />
    <SellerOrdersListSkeleton />
    <SellerPaginationSkeleton />
  </div>
);

export { SellerOrdersPageSkeleton };
