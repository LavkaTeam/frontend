import { Skeleton } from '@/components/ui/Skeleton';

import styles from './SellerOrdersPageSkeleton.module.css';

const SellerOrdersToolbarSkeleton = () => (
  <div className={styles.toolbar}>
    <div className={styles.filterGroup}>
      <Skeleton width={40} height={40} radius={8} />
      <Skeleton width={144} height={16} radius={999} />
      <Skeleton width={118} height={16} radius={999} />
    </div>

    <div className={styles.downloadGroup}>
      <Skeleton width={24} height={24} radius={6} />
      <Skeleton width={174} height={20} radius={8} />
    </div>
  </div>
);

export { SellerOrdersToolbarSkeleton };
