import styles from './CartProduct.module.css';

const CartProductSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardWrapper}>
        <div className={styles.cardContent}>
          <div className={styles.cardImg}>
            <div className={`${styles.skeletonImage} ${styles.skeletonPulse}`}></div>
          </div>
          <div className={styles.cardInfo}>
            <div
              className={`${styles.skeletonTitle} ${styles.skeletonPulse}`}
            ></div>
            <div
              className={`${styles.skeletonSubtitle} ${styles.skeletonPulse}`}
            ></div>
            <div className={styles.skeletonMetaRow}>
              <div
                className={`${styles.skeletonMetaChip} ${styles.skeletonMetaChipMd} ${styles.skeletonPulse}`}
              ></div>
              <div
                className={`${styles.skeletonMetaChip} ${styles.skeletonMetaChipLg} ${styles.skeletonPulse}`}
              ></div>
              <div
                className={`${styles.skeletonMetaChip} ${styles.skeletonMetaChipSm} ${styles.skeletonPulse}`}
              ></div>
            </div>
          </div>
          <div className={styles.cardPriceWrap}>
            <div className={`${styles.skeletonPrice} ${styles.skeletonPulse}`}></div>
            <div className={`${styles.skeletonSubtitle} ${styles.skeletonPulse}`}></div>
          </div>
          <div className={`${styles.skeletonQuantity} ${styles.skeletonPulse}`}></div>
          <div className={styles.cardTotalWrap}>
            <div className={`${styles.skeletonTotal} ${styles.skeletonPulse}`}></div>
            <div className={`${styles.skeletonSubtitle} ${styles.skeletonPulse}`}></div>
          </div>
          <div className={`${styles.skeletonDelete} ${styles.skeletonPulse}`}></div>
        </div>
      </div>
    </div>
  );
};

export { CartProductSkeleton };
