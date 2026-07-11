import styles from './AccountProfileFormSkeleton.module.css';

interface AccountProfileFormSkeletonProps {
  title?: string;
  description?: string;
}

const SkeletonField = ({ fullWidth = false }: { fullWidth?: boolean }) => (
  <div className={fullWidth ? styles.fullWidth : ''}>
    <div className={styles.fieldBlock}>
      <div className={`${styles.skeletonPulse} ${styles.fieldLabelSkeleton}`} />
      <div className={`${styles.skeletonPulse} ${styles.inputSkeleton}`} />
    </div>
  </div>
);

const AccountProfileFormSkeleton = ({
  title = 'Profile',
  description = 'Loading profile details',
}: AccountProfileFormSkeletonProps) => {
  return (
    <div className={styles.profileContent} aria-hidden='true'>
      <div>
        <h2 className={styles.profileTitle}>{title}</h2>
        <p className={styles.profileDescription}>{description}</p>
      </div>

      <div className={styles.profileLayout}>
        <section className={styles.section}>
          <div className={`${styles.skeletonPulse} ${styles.sectionTitleSkeleton}`} />
          <div className={styles.grid}>
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
            <div className={styles.fullWidth}>
              <div className={styles.actionRow}>
                <div className={styles.flexGrowField}>
                  <div className={styles.fieldBlock}>
                    <div className={`${styles.skeletonPulse} ${styles.fieldLabelSkeleton}`} />
                    <div className={`${styles.skeletonPulse} ${styles.inputSkeleton}`} />
                  </div>
                </div>
                <div className={`${styles.skeletonPulse} ${styles.inlineActionSkeleton}`} />
              </div>
            </div>
          </div>
        </section>

        <div className={styles.lightDivider} />

        <section className={styles.section}>
          <div className={`${styles.skeletonPulse} ${styles.sectionTitleSkeleton}`} />
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonField key={index} />
            ))}
            <div className={styles.fullWidth}>
              <div className={styles.licenseCard}>
                <div className={styles.licenseCardHeader}>
                  <div className={styles.licenseHeading}>
                    <div className={`${styles.skeletonPulse} ${styles.licenseLabelSkeleton}`} />
                    <div className={`${styles.skeletonPulse} ${styles.licenseValueSkeleton}`} />
                  </div>
                </div>
                <div className={styles.licenseFileRow}>
                  <div className={styles.licenseFileMeta}>
                    <div className={`${styles.skeletonPulse} ${styles.licenseFileNameSkeleton}`} />
                    <div className={`${styles.skeletonPulse} ${styles.licenseFileStatusSkeleton}`} />
                  </div>
                  <div className={`${styles.skeletonPulse} ${styles.licenseActionSkeleton}`} />
                </div>
              </div>
            </div>
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
          </div>
        </section>

        <div className={styles.saveBar}>
          <div className={`${styles.skeletonPulse} ${styles.textActionSkeleton}`} />
          <div className={`${styles.skeletonPulse} ${styles.buttonSkeleton}`} />
        </div>

        <div className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.addressHeader}>
            <div className={`${styles.skeletonPulse} ${styles.sectionTitleSkeleton}`} />
            <div className={`${styles.skeletonPulse} ${styles.addressButtonSkeleton}`} />
          </div>

          <div className={styles.addressList}>
            {Array.from({ length: 2 }).map((_, index) => (
              <article key={index} className={styles.addressCard}>
                <div className={styles.addressCardHeader}>
                  <div className={styles.addressCardText}>
                    <div className={`${styles.skeletonPulse} ${styles.addressTitleSkeleton}`} />
                    <div className={`${styles.skeletonPulse} ${styles.addressLineSkeleton}`} />
                    <div className={`${styles.skeletonPulse} ${styles.addressLineShortSkeleton}`} />
                  </div>
                  <div className={styles.addressActions}>
                    <div className={`${styles.skeletonPulse} ${styles.iconSkeleton}`} />
                    <div className={`${styles.skeletonPulse} ${styles.iconSkeleton}`} />
                  </div>
                </div>
                <div className={styles.lightDivider} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export { AccountProfileFormSkeleton };
