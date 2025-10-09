import type { ReactNode } from 'react';

import styles from './HeaderIcon.module.css';

interface HeaderIconProps {
  icon: ReactNode;
  iconText: string;
}

const HeaderIcon = ({ icon, iconText }: HeaderIconProps) => {
  return (
    <div className={styles.headerIcon}>
<<<<<<< HEAD
<<<<<<< HEAD
      <span>{icon}</span>
=======
      {icon}
>>>>>>> origin/master
=======
      <span>{icon}</span>
>>>>>>> origin/feature/create-product-page
      <span>{iconText}</span>
    </div>
  );
};
export { HeaderIcon };
