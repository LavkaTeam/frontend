import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import styles from './AdminPageHeader.module.css';

interface AdminPageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  backTo?: { to: string; label: string };
}

const AdminPageHeader = ({
  title,
  description,
  actions,
  backTo,
}: AdminPageHeaderProps) => (
  <header className={styles.header}>
    {backTo ? (
      <Link to={backTo.to} className={styles.back}>
        <span aria-hidden='true'>←</span> {backTo.label}
      </Link>
    ) : null}
    <div className={styles.row}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{title}</h1>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  </header>
);

export { AdminPageHeader };
