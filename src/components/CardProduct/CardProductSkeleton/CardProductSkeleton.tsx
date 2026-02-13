import styles from './CardProductSkeleton.module.css';

const CardProductSkeleton = () => {
  return (
    <div className={styles.cardProductSkeleton}>
      <div className={styles.cardImageSkeleton}></div>

      <div className={styles.cardProductInfoSkeleton}>
        <div className={styles.cardInStockSkeleton}></div>

        <div className={styles.cardProductDetailsSkeleton}>
          <div className={styles.headingSkeleton}></div>
          <div className={styles.headingSkeletonShort}></div>
          <div className={styles.capacitySkeleton}></div>
          <div className={styles.subHeadingSkeleton}></div>
          <div className={styles.skuSkeleton}></div>

          <span className={styles.divider}></span>
          <div className={styles.priceSkeleton}></div>
        </div>

        <div className={styles.buttonSkeleton}></div>
      </div>
    </div>
  );
};

export { CardProductSkeleton };
