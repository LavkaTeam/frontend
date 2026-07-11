import { Skeleton } from '@/components/ui/Skeleton';

import styles from './BuyerOrderSkeleton.module.css';

const BuyerOrderTopGridSkeleton = () => (
  <div className={styles.topGrid}>
    <section className={`${styles.card} ${styles.detailsCard}`}>
      <div className={styles.sectionHeader}>
        <Skeleton width={176} height={26} radius={8} />
      </div>

      <div className={styles.detailRows}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.detailRow}>
            <Skeleton width={96} height={16} radius={6} />
            <Skeleton
              width={`${60 + (index % 3) * 10}%`}
              height={18}
              radius={6}
            />
          </div>
        ))}
      </div>
    </section>

    <aside className={`${styles.card} ${styles.summaryCard}`}>
      <Skeleton width={156} height={26} radius={8} />

      <div className={styles.summaryRows}>
        <div className={styles.summaryRow}>
          <Skeleton width={108} height={16} radius={6} />
          <Skeleton width={76} height={18} radius={6} />
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={styles.summaryRow}>
            <Skeleton width={118} height={16} radius={6} />
            <Skeleton width={index === 2 ? 96 : 72} height={18} radius={6} />
          </div>
        ))}

        <div className={`${styles.summaryRows} ${styles.summarySpacer}`}>
          <div className={styles.summaryRow}>
            <Skeleton width={88} height={16} radius={6} />
            <Skeleton width={74} height={18} radius={6} />
          </div>
          <div className={styles.summaryRow}>
            <Skeleton width={64} height={22} radius={6} />
            <Skeleton width={108} height={24} radius={6} />
          </div>
        </div>
      </div>
    </aside>
  </div>
);

export { BuyerOrderTopGridSkeleton };
