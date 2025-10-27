import type { ReactNode } from 'react';
import styles from './HeaderIcon.module.css';

interface HeaderIconProps {
  icon: ReactNode;
  iconText: string;
  count?: number;
}

const HeaderIcon = ({ icon, iconText, count = 0 }: HeaderIconProps) => {
  const displayCount = count > 99 ? '99+' : count;

  return (
    <div className={styles.headerIcon}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
        {count > 0 && (
          <div className={styles.badge}>
            <span className={styles.badgeNumber}>{displayCount}</span>
          </div>
        )}
      </div>
      <span className={styles.iconText}>{iconText}</span>
    </div>
  );
};

export { HeaderIcon };
