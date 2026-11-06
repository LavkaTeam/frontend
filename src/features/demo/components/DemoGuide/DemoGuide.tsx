import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDemoMe } from '../../api';
import { demoCopy } from '../../model/demoCopy';
import type { DemoRole } from '../../types';

import styles from './DemoGuide.module.css';

interface DemoGuideProps {
  role: DemoRole;
  isOpen: boolean;
  onClose: () => void;
}

// "Things to try": a short list for the current role, in a panel on the side.
// Nothing is tracked, it is only a list.
const DemoGuide = ({ role, isOpen, onClose }: DemoGuideProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  // The buyer is told which supplier is theirs: only orders to it show up on
  // the seller side of the sandbox.
  const { data: me } = useQuery({
    queryKey: ['demo', 'me'],
    queryFn: getDemoMe,
    enabled: isOpen && role === 'BUYER',
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.panel}
        role='dialog'
        aria-modal='true'
        aria-labelledby='demo-guide-title'
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id='demo-guide-title' className={styles.title}>
            {demoCopy.guide.title}
          </h2>
          <button
            ref={closeRef}
            type='button'
            className={styles.close}
            aria-label={demoCopy.guide.close}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <ol className={styles.list}>
          {demoCopy.guide[role].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>

        {role === 'BUYER' && me ? (
          <p className={styles.paired}>
            {demoCopy.guide.paired(me.pairedUser.companyName)}
          </p>
        ) : null}
      </aside>
    </div>
  );
};

export { DemoGuide };
