import type { ReactNode } from 'react';

import styles from './BlockingOverlay.module.css';

interface BlockingOverlayProps {
  active: boolean;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
}

const BlockingOverlay = ({
  active,
  children,
  className = '',
  overlayClassName = '',
}: BlockingOverlayProps) => (
  <div
    className={`${styles.wrapper} ${className}`.trim()}
    aria-busy={active}
    aria-live='polite'
  >
    {children}
    {active ? (
      <div
        className={`${styles.overlay} ${overlayClassName}`.trim()}
        aria-hidden='true'
      />
    ) : null}
  </div>
);

export { BlockingOverlay };
