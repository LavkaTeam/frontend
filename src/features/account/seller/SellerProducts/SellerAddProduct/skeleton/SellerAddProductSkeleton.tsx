import { Skeleton } from '@/components/ui/Skeleton';

import styles from './SellerAddProductSkeleton.module.css';

const SellerAddProductSkeleton = () => (
  <div className={styles.container}>
    <div className={styles.header}>
      <div className={styles.headerCopy}>
        <Skeleton width={280} height={44} radius={10} />
        <Skeleton width={640} height={28} radius={8} />
      </div>

      <div className={styles.headerActions}>
        <Skeleton width={160} height={48} radius={8} />
        <Skeleton width={160} height={48} radius={8} />
      </div>
    </div>

    <div className={styles.contentGrid}>
      <div className={styles.leftCol}>
        <Skeleton className={styles.imageStage} radius={12} />

        <div className={styles.thumbnailList}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.thumbnailCard}>
              <Skeleton width={40} height={40} radius={8} />
              <div className={styles.thumbnailMeta}>
                <Skeleton width='72%' height={16} radius={6} />
                <Skeleton width='48%' height={14} radius={6} />
              </div>
              <Skeleton width={40} height={40} radius={10} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.rightCol}>
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <Skeleton width={220} height={32} radius={8} />
            <Skeleton width={340} height={24} radius={8} />
          </div>

          <div className={styles.formGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={styles.fieldBlock}>
                <Skeleton width={124} height={16} radius={6} />
                <Skeleton width='100%' height={48} radius={10} />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <Skeleton width={250} height={32} radius={8} />
            <Skeleton width={360} height={24} radius={8} />
          </div>

          <div className={styles.pricingGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={styles.fieldBlock}>
                <Skeleton width={148} height={16} radius={6} />
                <Skeleton width='100%' height={48} radius={10} />
              </div>
            ))}
          </div>

          <div className={styles.toggleRow}>
            <Skeleton width={168} height={40} radius={999} />
            <Skeleton width={188} height={40} radius={999} />
          </div>

          <div className={styles.pricingCard}>
            <div className={styles.pricingCardHeader}>
              <div className={styles.sectionHeaderCompact}>
                <Skeleton width={158} height={22} radius={8} />
                <Skeleton width={300} height={20} radius={8} />
              </div>
              <Skeleton width={88} height={32} radius={999} />
            </div>

            <div className={styles.fieldBlock}>
              <Skeleton width={146} height={16} radius={6} />
              <Skeleton width='100%' height={48} radius={10} />
            </div>
          </div>

          <div className={styles.wholesalePanel}>
            <div className={styles.wholesaleHeader}>
              <div className={styles.sectionHeaderCompact}>
                <Skeleton width={166} height={22} radius={8} />
                <Skeleton width={360} height={20} radius={8} />
              </div>
              <Skeleton width={88} height={32} radius={999} />
            </div>

            <div className={styles.tierList}>
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className={styles.tierCard}>
                  <div className={styles.tierGrid}>
                    <div className={styles.fieldBlock}>
                      <Skeleton width={132} height={16} radius={6} />
                      <Skeleton width='100%' height={48} radius={10} />
                    </div>
                    <div className={styles.fieldBlock}>
                      <Skeleton width={118} height={16} radius={6} />
                      <Skeleton width='100%' height={48} radius={10} />
                    </div>
                    <div className={styles.tierSummary}>
                      <Skeleton width={118} height={16} radius={6} />
                      <Skeleton width='100%' height={56} radius={12} />
                    </div>
                  </div>

                  <Skeleton className={styles.removeTierButton} radius={10} />
                </div>
              ))}
            </div>

            <Skeleton width={118} height={38} radius={999} />
          </div>
        </section>

        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <Skeleton width={234} height={32} radius={8} />
            <Skeleton width={324} height={24} radius={8} />
          </div>

          <div className={styles.formGridWide}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={styles.fieldBlock}>
                <Skeleton width={index < 2 ? 136 : 124} height={16} radius={6} />
                <Skeleton width='100%' height={48} radius={10} />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <Skeleton width={244} height={32} radius={8} />
            <Skeleton width={360} height={24} radius={8} />
          </div>

          <div className={styles.descriptionBlock}>
            <Skeleton width={118} height={16} radius={6} />
            <Skeleton width='100%' height={184} radius={10} />
          </div>

          <div className={styles.tagsBlock}>
            <Skeleton width={64} height={16} radius={6} />
            <Skeleton width='100%' height={56} radius={10} />
          </div>
        </section>
      </div>
    </div>
  </div>
);

export { SellerAddProductSkeleton };
