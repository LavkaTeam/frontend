import styles from './CardProductSkeleton.module.css';

const CardProductSkeleton = () => {
  return (
    <div className={styles.cardProductSkeleton}>
      <div className={styles.favoriteIconSkeleton}></div>

      <div className={styles.cardImageWrapperSkeleton}>
        <div className={styles.cardImageSkeleton}></div>
      </div>

      <div className={styles.cardProductInfoSkeleton}>
        <div className={styles.cardDetailsTopSkeleton}>
          <div className={styles.cardInStockSkeleton}>
            <div className={styles.inStockMock}></div>
            <div className={styles.skuMock}></div>
          </div>
          <div className={styles.headingAndSubSkeleton}>
            <div className={styles.headingSkeleton}></div>
            <div className={styles.headingSkeletonShort}></div>
            <div className={styles.subHeadingSkeleton}></div>
            <div className={styles.subHeadingSkeletonLong}></div>
          </div>
          <div className={styles.ratingSkeleton}></div>
        </div>

        <div className={styles.cardDetailsBottomSkeleton}>
          <span className={styles.divider}></span>
          <div className={styles.priceRowSkeleton}>
            <div className={styles.priceSkeleton}></div>
          </div>
          <div className={styles.cartButtonWrapperSkeleton}>
            <div className={styles.buttonSkeleton}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CardProductSkeleton };

