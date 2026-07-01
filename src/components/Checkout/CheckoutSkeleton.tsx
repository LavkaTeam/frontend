import { HeadingH3 } from '@/components/ui/HeadingH3';
import styles from '@/pages/Checkout.module.css';

const SummaryItemSkeleton = ({ keyId }: { keyId: string }) => (
  <div key={keyId} className={styles.summaryItem}>
    <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryImageSkeleton}`} />
    <div className={styles.summaryMetaSkeleton}>
      <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryTitleSkeleton}`} />
      <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryLineSkeleton}`} />
    </div>
    <div className={styles.summaryPriceSkeletonWrap}>
      <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryPriceSkeleton}`} />
      <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryTaxSkeleton}`} />
    </div>
  </div>
);

const CheckoutSkeleton = () => {
  return (
    <main className={`container ${styles.checkout}`}>
      <div className={styles.header}>
        <HeadingH3>Checkout</HeadingH3>
      </div>

      <div className={styles.layout} aria-hidden='true'>
        <section className={styles.formColumn}>
          <div className={styles.card}>
            <div className={`${styles.checkoutSkeletonPulse} ${styles.sectionTitleSkeleton}`} />

            <div className={styles.companyCard}>
              <div className={styles.companyHeader}>
                <div className={styles.companyHeaderSkeleton}>
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.companyNameSkeleton}`} />
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.companyStatusSkeleton}`} />
                </div>
                <div className={`${styles.checkoutSkeletonPulse} ${styles.companyActionSkeleton}`} />
              </div>

              <div className={styles.companyMeta}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className={styles.companyMetaRow}>
                    <div className={`${styles.checkoutSkeletonPulse} ${styles.companyMetaLabelSkeleton}`} />
                    <div className={`${styles.checkoutSkeletonPulse} ${styles.companyMetaValueSkeleton}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={`${styles.checkoutSkeletonPulse} ${styles.sectionTitleSkeleton}`} />
            <div className={styles.groupBlock}>
              <div className={`${styles.checkoutSkeletonPulse} ${styles.groupLabelSkeleton}`} />
              <div className={styles.optionList}>
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className={styles.optionCard}>
                    <div className={styles.optionContent}>
                      <div className={`${styles.checkoutSkeletonPulse} ${styles.optionIconSkeleton}`} />
                      <div className={styles.paymentText}>
                        <div className={`${styles.checkoutSkeletonPulse} ${styles.optionTitleSkeleton}`} />
                        <div className={`${styles.checkoutSkeletonPulse} ${styles.optionDescriptionSkeleton}`} />
                      </div>
                      <div className={`${styles.checkoutSkeletonPulse} ${styles.optionIndicatorSkeleton}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.recipientCard}>
              <div className={`${styles.checkoutSkeletonPulse} ${styles.recipientEyebrowSkeleton}`} />
              <div className={`${styles.checkoutSkeletonPulse} ${styles.recipientNameSkeleton}`} />
              <div className={`${styles.checkoutSkeletonPulse} ${styles.recipientPhoneSkeleton}`} />

              <div className={styles.sectionGroup}>
                <div className={styles.grid}>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className={styles.field}>
                      <div className={`${styles.checkoutSkeletonPulse} ${styles.fieldLabelSkeleton}`} />
                      <div className={`${styles.checkoutSkeletonPulse} ${styles.inputSkeleton}`} />
                    </div>
                  ))}
                </div>
                <div className={styles.field}>
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.fieldLabelSkeleton}`} />
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.inputSkeleton}`} />
                </div>
                <div className={styles.field}>
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.fieldLabelSkeleton}`} />
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.inputSkeleton}`} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={`${styles.checkoutSkeletonPulse} ${styles.sectionTitleSkeleton}`} />
            <div className={styles.groupBlock}>
              <div className={`${styles.checkoutSkeletonPulse} ${styles.groupLabelSkeleton}`} />
              <div className={styles.paymentList}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className={styles.paymentCard}>
                    <div className={styles.paymentCardInner}>
                      <div className={`${styles.checkoutSkeletonPulse} ${styles.optionIconSkeleton}`} />
                      <div className={styles.paymentText}>
                        <div className={`${styles.checkoutSkeletonPulse} ${styles.optionTitleSkeleton}`} />
                        <div className={`${styles.checkoutSkeletonPulse} ${styles.optionDescriptionSkeleton}`} />
                        <div className={`${styles.checkoutSkeletonPulse} ${styles.optionHintSkeleton}`} />
                      </div>
                      <div className={`${styles.checkoutSkeletonPulse} ${styles.optionIndicatorSkeleton}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <div className={`${styles.checkoutSkeletonPulse} ${styles.fieldLabelSkeleton}`} />
              <div className={`${styles.checkoutSkeletonPulse} ${styles.textareaSkeleton}`} />
            </div>
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeader}>
              <div className={`${styles.checkoutSkeletonPulse} ${styles.sidebarTitleSkeleton}`} />
            </div>

            <div className={styles.sidebarOrders}>
              {Array.from({ length: 2 }).map((_, orderIndex) => (
                <article key={orderIndex} className={styles.sellerOrder}>
                  <div className={styles.sellerOrderHeader}>
                    <div>
                      <div className={`${styles.checkoutSkeletonPulse} ${styles.sellerEyebrowSkeleton}`} />
                      <div className={`${styles.checkoutSkeletonPulse} ${styles.sellerTitleSkeleton}`} />
                    </div>
                  </div>

                  <div className={styles.sellerOrderItems}>
                    {Array.from({ length: 2 }).map((__, itemIndex) => (
                      <SummaryItemSkeleton
                        key={`${orderIndex}-${itemIndex}`}
                        keyId={`${orderIndex}-${itemIndex}`}
                      />
                    ))}
                  </div>

                  <div className={styles.sellerSummaryCard}>
                    {Array.from({ length: 3 }).map((__, rowIndex) => (
                      <div key={rowIndex} className={styles.sellerSummaryRow}>
                        <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryLabelSkeleton}`} />
                        <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryValueSkeleton}`} />
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.totalPrice}>
              <div className={styles.summaryBlock}>
                <div className={styles.totalInfo}>
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryLabelSkeleton}`} />
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryValueSkeleton}`} />
                </div>
              </div>

              <div className={styles.summaryBlock}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className={styles.totalInfo}>
                    <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryLabelSkeleton}`} />
                    <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryValueSkeleton}`} />
                  </div>
                ))}
              </div>

              <div className={`${styles.summaryBlock} ${styles.totalBlock}`}>
                <div className={styles.totalInfo}>
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryLabelSkeleton}`} />
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.summaryValueSkeleton}`} />
                </div>
                <div className={styles.totalInfo}>
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.totalLabelSkeleton}`} />
                  <div className={`${styles.checkoutSkeletonPulse} ${styles.totalValueSkeleton}`} />
                </div>
              </div>

              <div className={styles.checkoutButton}>
                <div className={`${styles.checkoutSkeletonPulse} ${styles.buttonSkeleton}`} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export { CheckoutSkeleton };
