import { Skeleton } from '@/components/ui/Skeleton';

import styles from './TransactionDetailsDrawer.module.css';

const TransactionDetailsDrawerSkeleton = () => (
  <>
    <div className={styles.drawerSection}>
      <Skeleton width='100%' height={28} radius={8} />
      <Skeleton width='100%' height={28} radius={8} />
      <Skeleton width='100%' height={28} radius={8} />
      <Skeleton width='100%' height={28} radius={8} />
    </div>

    <div className={styles.drawerSection}>
      <Skeleton width='100%' height={28} radius={8} />
      <Skeleton width='100%' height={28} radius={8} />
      <Skeleton width='100%' height={28} radius={8} />
      <Skeleton width='78%' height={22} radius={8} />
    </div>
  </>
);

export { TransactionDetailsDrawerSkeleton };
