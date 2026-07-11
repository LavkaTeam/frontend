import { Skeleton } from '@/components/ui/Skeleton';

import { BuyerOrdersListSkeleton } from './BuyerOrdersListSkeleton';
import { BuyerOrdersToolbarSkeleton } from './BuyerOrdersToolbarSkeleton';
import styles from './BuyerOrdersPageSkeleton.module.css';

const BuyerOrdersPageSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <Skeleton width={184} height={44} radius={8} />
      <Skeleton width={312} height={28} radius={8} />
    </div>

    <BuyerOrdersToolbarSkeleton />
    <BuyerOrdersListSkeleton />

    <div className={styles.pagination}>
      <Skeleton width={40} height={40} radius={10} />
      <Skeleton width={40} height={40} radius={10} />
      <Skeleton width={40} height={40} radius={10} />
    </div>
  </div>
);

export { BuyerOrdersPageSkeleton };
