import type { ReactNode } from 'react';
import styles from './HeaderIcon.module.css';

interface HeaderIconProps {
  icon: ReactNode;
  iconText: string;
}

const HeaderIcon = ({ icon, iconText }: HeaderIconProps) => {
  return (
    <div className={styles.headerIcon}>
      <span>{icon}</span>
      <span>{iconText}</span>
    </div>
  );
};

export { HeaderIcon };
