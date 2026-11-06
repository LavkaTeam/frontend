import { useRef, useState } from 'react';

import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

import { useDemoSession } from '../../hooks/useDemoSession';
import { demoCopy } from '../../model/demoCopy';
import type { DemoRole } from '../../types';
import { DemoGuide } from '../DemoGuide/DemoGuide';

import styles from './DemoMenu.module.css';

interface DemoMenuProps {
  role: DemoRole;
}

const otherRole = (role: DemoRole): DemoRole =>
  role === 'BUYER' ? 'SELLER' : 'BUYER';

// Menu of the banner: switch the role, reset the sandbox, leave the demo, and
// the list of things worth trying.
const DemoMenu = ({ role }: DemoMenuProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const session = useDemoSession();

  useOnClickOutside(rootRef, () => setIsOpen(false));

  const close = () => setIsOpen(false);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type='button'
        className={styles.trigger}
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-busy={session.isBusy}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') close();
        }}
      >
        {demoCopy.banner.menu}
        <span className={styles.caret} aria-hidden='true' />
      </button>

      {isOpen ? (
        <div className={styles.menu} role='menu'>
          <button
            type='button'
            role='menuitem'
            className={styles.item}
            disabled={session.isBusy}
            onClick={() => {
              close();
              session.switchRole();
            }}
          >
            {demoCopy.menu.switchTo(otherRole(role))}
          </button>
          <button
            type='button'
            role='menuitem'
            className={styles.item}
            disabled={session.isBusy || session.cooldownSeconds > 0}
            onClick={() => {
              close();
              setIsConfirmingReset(true);
            }}
          >
            {session.cooldownSeconds > 0
              ? demoCopy.cta.retryIn(session.cooldownSeconds)
              : demoCopy.menu.reset}
          </button>
          <button
            type='button'
            role='menuitem'
            className={styles.item}
            onClick={() => {
              close();
              setIsGuideOpen(true);
            }}
          >
            {demoCopy.banner.thingsToTry}
          </button>
          <button
            type='button'
            role='menuitem'
            className={`${styles.item} ${styles.exit}`}
            disabled={session.isBusy}
            onClick={() => {
              close();
              session.exit();
            }}
          >
            {demoCopy.menu.exit}
          </button>
          <p className={styles.current}>{demoCopy.menu.currentView(role)}</p>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={isConfirmingReset}
        title={demoCopy.reset.title}
        message={demoCopy.reset.message}
        confirmText={demoCopy.reset.confirm}
        variant='warning'
        onCancel={() => setIsConfirmingReset(false)}
        onConfirm={() => {
          setIsConfirmingReset(false);
          session.reset(role);
        }}
      />

      <DemoGuide
        role={role}
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};

export { DemoMenu };
