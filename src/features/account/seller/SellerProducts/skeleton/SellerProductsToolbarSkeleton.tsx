import { Skeleton } from '@/components/ui/Skeleton';

import styles from './SellerProductsPageSkeleton.module.css';

const SellerProductsToolbarSkeleton = () => (
  <div className={styles.toolbar}>
    <div className={styles.filterGroup}>
      <Skeleton width={40} height={40} radius={6} />
      <Skeleton width={144} height={16} radius={999} />
      <Skeleton width={118} height={16} radius={999} />
    </div>

    <Skeleton width={74} height={18} radius={8} />
  </div>
);

export { SellerProductsToolbarSkeleton };
