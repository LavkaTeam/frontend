import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { extractErrorMessage } from '@/utils/error';

import { useDemoTtlHours } from '../../hooks/useDemoInfo';
import { useDemoSession } from '../../hooks/useDemoSession';
import { demoCopy } from '../../model/demoCopy';
import {
  getDemoExpired,
  setDemoExpired,
  subscribeToDemoExpiry,
} from '../../model/demoExpiryStore';
import type { DemoRole } from '../../types';

import styles from './DemoExpiredModal.module.css';

const FOCUSABLE = 'button:not(:disabled), a[href]';

// "Your demo has ended". It stays until the visitor picks an action: clicking
// the backdrop or pressing Escape does nothing, and focus cannot leave it.
const DemoExpiredModal = () => {
  const isOpen = useSyncExternalStore(subscribeToDemoExpiry, getDemoExpired);
  const navigate = useNavigate();
  const ttlHours = useDemoTtlHours();
  const session = useDemoSession();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus trap: Tab and Shift+Tab cycle inside the dialog.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialog) return;

      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const label = (role: DemoRole) =>
    session.creatingRole === role
      ? demoCopy.cta.preparing
      : session.cooldownSeconds > 0
        ? demoCopy.cta.retryIn(session.cooldownSeconds)
        : demoCopy.cta.explore(role);

  const leave = () => {
    setDemoExpired(false);
    navigate('/products');
  };

  return (
    <div className={styles.overlay}>
      <div
        ref={dialogRef}
        className={styles.modal}
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='demo-expired-title'
        aria-describedby='demo-expired-text'
      >
        <h2 id='demo-expired-title' className={styles.title}>
          {demoCopy.expired.title}
        </h2>
        <p id='demo-expired-text' className={styles.text}>
          {demoCopy.expired.text(ttlHours)}
        </p>

        <div className={styles.actions}>
          {(['BUYER', 'SELLER'] as const).map((role) => (
            <Button
              key={role}
              type='button'
              className={styles.button}
              isLoading={session.creatingRole === role}
              disabled={session.isBusy || session.cooldownSeconds > 0}
              aria-busy={session.creatingRole === role}
              onClick={() => session.createSession(role)}
            >
              {label(role)}
            </Button>
          ))}
          <Button
            type='button'
            variant='secondary'
            className={styles.button}
            disabled={session.isBusy}
            onClick={leave}
          >
            {demoCopy.expired.backToCatalog}
          </Button>
        </div>

        <p className={styles.status} role='status' aria-live='polite'>
          {session.isSlow ? demoCopy.cta.waking : ''}
        </p>
        {session.error && !session.isBusy ? (
          <p className={styles.error} role='alert'>
            {extractErrorMessage(session.error, demoCopy.errors.generic)}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export { DemoExpiredModal };
