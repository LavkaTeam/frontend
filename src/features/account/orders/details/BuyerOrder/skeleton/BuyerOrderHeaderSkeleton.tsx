import { Skeleton } from '@/components/ui/Skeleton';

import styles from './BuyerOrderSkeleton.module.css';

const BuyerOrderHeaderSkeleton = () => (
  <section className={`${styles.card} ${styles.headerCard}`}>
    <div className={styles.headerStack}>
      <div className={styles.titleRow}>
        <Skeleton width={220} height={34} radius={8} />
        <Skeleton width={108} height={26} radius={999} />
        <Skeleton width={96} height={26} radius={999} />
      </div>

      <Skeleton width={168} height={18} radius={6} />

      <div className={styles.metaGrid}>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className={styles.metaItem}>
            <Skeleton width={72} height={12} radius={6} />
            <Skeleton width={148} height={18} radius={6} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export { BuyerOrderHeaderSkeleton };
