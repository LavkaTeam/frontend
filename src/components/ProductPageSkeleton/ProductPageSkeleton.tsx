import { CardProductSkeleton } from '@/components/CardProduct';
import styles from './ProductPageSkeleton.module.css';

const ProductPageSkeleton = () => {
  return (
    <div className={styles.pageSkeleton}>
      <div className={styles.productPageSkeleton}>
        <div className={styles.imageColumn}>
          <div className={styles.imageCard}>
            <div className={styles.imageSkeleton}></div>
            <div className={styles.thumbRow}>
              <div className={styles.thumbSkeleton}></div>
              <div className={styles.thumbSkeleton}></div>
              <div className={styles.thumbSkeleton}></div>
            </div>
          </div>
        </div>

        <div className={styles.contentColumn}>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.stockRowSkeleton}>
            <div className={styles.stockSkeleton}></div>
            <div className={styles.skuSkeleton}></div>
          </div>
          <div className={styles.ratingSkeleton}></div>
          <div className={styles.priceSkeleton}></div>

          <div className={styles.infoGridSkeleton}>
            <div className={styles.infoGrid}>
              <div className={styles.infoColumn}>
                <div className={styles.infoLabel}></div>
                <div className={styles.infoValue}></div>
                <div className={styles.infoLabel}></div>
                <div className={styles.infoValue}></div>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.infoColumn}>
                <div className={styles.infoLabel}></div>
                <div className={styles.infoValue}></div>
                <div className={styles.infoLabel}></div>
                <div className={styles.infoValue}></div>
              </div>
            </div>
            <div className={styles.infoButtonRow}>
              <div className={styles.infoButton}></div>
            </div>
          </div>

          <div className={styles.tiersBlock}>
            <div className={styles.blockTitle}></div>
            <div className={styles.tierLine}></div>
            <div className={styles.tierLine}></div>
            <div className={styles.tierLine}></div>
          </div>

          <div className={styles.descriptionBlock}>
            <div className={styles.blockTitle}></div>
            <div className={styles.paragraph}></div>
            <div className={styles.paragraph}></div>
            <div className={styles.paragraphShort}></div>
          </div>

          <div className={styles.actionsRow}>
            <div className={styles.actionArea}>
              <div className={styles.minOrderSkeleton}></div>
              <div className={styles.buttonSkeleton}></div>
            </div>
            <div className={styles.favoriteButtonSkeleton}></div>
          </div>

          <div className={styles.descriptionBlock}>
            <div className={styles.blockTitle}></div>
            <div className={styles.paragraph}></div>
            <div className={styles.paragraph}></div>
            <div className={styles.paragraphShort}></div>
          </div>

          <div className={styles.sellerBlock}>
            <div className={styles.blockTitle}></div>
            <div className={styles.sellerSkeletonRow}>
              <div className={styles.sellerLogoSkeleton}></div>
              <div className={styles.sellerLinkSkeleton}></div>
            </div>
            <div className={styles.sellerLineLong}></div>
            <div className={styles.sellerLine}></div>
            <div className={styles.sellerLine}></div>
          </div>
        </div>
      </div>

      <div className={styles.relatedSection}>
        <div className={styles.relatedHeader}></div>
        <div className={styles.relatedGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <CardProductSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export { ProductPageSkeleton };
