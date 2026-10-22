import type { ReactNode } from 'react';

import styles from './StatusBadge.module.css';

// Colours of the status chips used in the seller tables.
export type BadgeTone = 'gray' | 'green' | 'amber' | 'orange' | 'burgundy';

interface StatusBadgeProps {
  tone: BadgeTone;
  children: ReactNode;
  title?: string;
}

const StatusBadge = ({ tone, children, title }: StatusBadgeProps) => (
  <span className={`${styles.badge} ${styles[tone]}`} title={title}>
    {children}
  </span>
);

export { StatusBadge };
