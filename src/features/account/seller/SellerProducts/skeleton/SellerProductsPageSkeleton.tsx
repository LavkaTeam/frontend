import { Skeleton } from '@/components/ui/Skeleton';

import { SellerPaginationSkeleton } from '../../shared/SellerPaginationSkeleton';
import { SellerProductsListSkeleton } from './SellerProductsListSkeleton';
import { SellerProductsToolbarSkeleton } from './SellerProductsToolbarSkeleton';
import styles from './SellerProductsPageSkeleton.module.css';

const SellerProductsPageSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <div className={styles.titleBlock}>
        <Skeleton width={206} height={44} radius={8} />
        <Skeleton width={628} height={28} radius={8} />
      </div>

      <div className={styles.actionBlock}>
        <Skeleton width='100%' height={48} radius={8} />
      </div>
    </div>

    <SellerProductsToolbarSkeleton />
    <SellerProductsListSkeleton />
    <SellerPaginationSkeleton />
  </div>
);

export { SellerProductsPageSkeleton };
