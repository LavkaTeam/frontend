import { Skeleton } from '@/components/ui/Skeleton';

import { BuyerOrderContentSkeleton } from './BuyerOrderContentSkeleton';
import { BuyerOrderHeaderSkeleton } from './BuyerOrderHeaderSkeleton';
import { BuyerOrderTopGridSkeleton } from './BuyerOrderTopGridSkeleton';
import styles from './BuyerOrderSkeleton.module.css';

const BuyerOrderSkeleton = () => (
  <div className={styles.container}>
    <div className={styles.backRow}>
      <Skeleton width={18} height={18} radius={999} />
      <Skeleton width={118} height={18} radius={6} />
    </div>

    <BuyerOrderHeaderSkeleton />
    <BuyerOrderTopGridSkeleton />
    <BuyerOrderContentSkeleton />
  </div>
);

export { BuyerOrderSkeleton };
