import styles from './FilterBlockSkeleton.module.css';

const FilterBlockSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* Price Range Skeleton */}
      <div className={styles.FilterBox}>
        <div className={styles.labelSkeleton}></div>
        <div className={styles.priceRangeSkeleton}>
          <div className={styles.inputsRowSkeleton}>
            <div className={styles.inputSkeleton}></div>
            <div className={styles.dividerSkeleton}></div>
            <div className={styles.inputSkeleton}></div>
          </div>
          <div className={styles.sliderSkeleton}></div>
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Countries Skeleton */}
      <div className={styles.FilterBox}>
        <div className={styles.dropdownSkeleton}></div>
      </div>

      <div className={styles.divider}></div>

      {/* Strength Skeleton */}
      <div className={styles.FilterBox}>
        <div className={styles.labelSkeleton}></div>
        <div className={styles.selectFilterBoxSkeleton}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.checkboxItemSkeleton}></div>
          ))}
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Capacity Skeleton */}
      <div className={styles.FilterBox}>
        <div className={styles.labelSkeleton}></div>
        <div className={styles.selectFilterBoxSkeleton}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.checkboxItemSkeleton}></div>
          ))}
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Brands Skeleton */}
      <div className={styles.FilterBox}>
        <div className={styles.labelSkeleton}></div>
        <div className={styles.selectFilterBoxSkeleton}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.checkboxItemSkeleton}></div>
          ))}
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Promotions Toggle Skeleton */}
      <div className={styles.FilterBox} style={{ marginTop: '32px' }}>
        <div className={styles.toggleSkeleton}></div>
      </div>

      <div className={styles.clearButtonSkeleton}></div>
    </div>
  );
};

export { FilterBlockSkeleton };
