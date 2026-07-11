import { Skeleton } from '@/components/ui/Skeleton';

import styles from './BuyerOrdersPageSkeleton.module.css';

const BuyerOrdersToolbarSkeleton = () => (
  <div className={styles.toolbar}>
    <div className={styles.filterGroup}>
      <Skeleton width={40} height={40} radius={8} />
      <Skeleton width={144} height={16} radius={999} />
      <Skeleton width={118} height={16} radius={999} />
    </div>

    <Skeleton width={210} height={24} radius={8} />
  </div>
);

export { BuyerOrdersToolbarSkeleton };
