import { Skeleton } from '@/components/ui/Skeleton';

import styles from './SellerPaginationSkeleton.module.css';

const SellerPaginationSkeleton = () => (
  <div className={styles.pagination}>
    <Skeleton width={92} height={40} radius={8} />
    <div className={styles.paginationNumbers}>
      <Skeleton width={40} height={40} radius={8} />
      <Skeleton width={40} height={40} radius={8} />
      <Skeleton width={40} height={40} radius={8} />
    </div>
    <Skeleton width={68} height={40} radius={8} />
  </div>
);

export { SellerPaginationSkeleton };
