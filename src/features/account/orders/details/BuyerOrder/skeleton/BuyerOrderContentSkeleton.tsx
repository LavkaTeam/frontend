import { Skeleton } from '@/components/ui/Skeleton';

import styles from './BuyerOrderSkeleton.module.css';

const BuyerOrderContentSkeleton = () => (
  <>
    <section className={`${styles.card} ${styles.documentsCard}`}>
      <Skeleton width={114} height={26} radius={8} />

      <div className={styles.documentsRows}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={styles.documentRow}>
            <div className={styles.documentMeta}>
              <Skeleton width={172} height={18} radius={6} />
              <Skeleton width={148} height={16} radius={6} />
            </div>
            <Skeleton width={116} height={38} radius={8} />
          </div>
        ))}
      </div>
    </section>

    <section className={`${styles.card} ${styles.productsCard}`}>
      <div className={styles.productsHeader}>
        <Skeleton width={186} height={26} radius={8} />
        <Skeleton width={74} height={20} radius={6} />
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <Skeleton height={16} radius={6} />
          <Skeleton height={16} radius={6} />
          <Skeleton height={16} radius={6} />
          <Skeleton height={16} radius={6} />
        </div>

        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.productCell}>
              <Skeleton className={styles.imageWrap} radius={12} />
              <div className={styles.productMeta}>
                <Skeleton width='88%' height={18} radius={6} />
                <Skeleton width='74%' height={18} radius={6} />
              </div>
            </div>
            <div className={styles.priceCell}>
              <Skeleton width={76} height={18} radius={6} />
              <Skeleton width={92} height={14} radius={6} />
            </div>
            <div className={styles.amountCell}>
              <Skeleton width={22} height={18} radius={6} />
            </div>
            <div className={styles.totalCell}>
              <Skeleton width={84} height={18} radius={6} />
            </div>
          </div>
        ))}
      </div>
    </section>
  </>
);

export { BuyerOrderContentSkeleton };
