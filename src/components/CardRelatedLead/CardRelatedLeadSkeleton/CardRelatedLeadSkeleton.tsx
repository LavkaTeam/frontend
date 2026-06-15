import styles from './CardRelatedLeadSkeleton.module.css';

const CardRelatedLeadSkeleton = () => {
  return (
    <div className={styles.leadCardSkeleton}>
      <div className={styles.imageSkeleton} />
      <div className={styles.contentSkeleton}>
        <div className={styles.titleSkeleton} />
        <div className={styles.descriptionSkeleton} />
        <div className={styles.readMoreBlockSkeleton}>
          <div className={styles.buttonSkeleton} />
        </div>
      </div>
    </div>
  );
};

export { CardRelatedLeadSkeleton };
