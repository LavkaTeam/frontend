import { Button } from '@/components/ui/Button';
import { extractErrorMessage } from '@/utils/error';

import { useDemoSession } from '../../hooks/useDemoSession';
import { demoCopy } from '../../model/demoCopy';
import type { DemoRole } from '../../types';

import styles from './DemoRoleCards.module.css';

interface DemoRoleCardsProps {
  // A shorter version for the home page: no feature lists.
  compact?: boolean;
  // Where to go after the sandbox is ready; the account by default.
  from?: string;
}

const ROLES: DemoRole[] = ['BUYER', 'SELLER'];

// Two cards, one per role. The sandbox is created by a click on a card and the
// visitor lands in a ready account.
const DemoRoleCards = ({ compact = false, from }: DemoRoleCardsProps) => {
  const session = useDemoSession();
  const isWaiting = session.cooldownSeconds > 0;

  const status = session.isSlow
    ? demoCopy.cta.waking
    : session.isCreating
      ? demoCopy.cta.preparing
      : '';

  const buttonLabel = (role: DemoRole) => {
    if (session.creatingRole === role) return demoCopy.cta.preparing;
    if (isWaiting) return demoCopy.cta.retryIn(session.cooldownSeconds);

    return demoCopy.cta.explore(role);
  };

  return (
    <div>
      <div className={`${styles.cards} ${compact ? styles.compact : ''}`}>
        {ROLES.map((role) => (
          <article key={role} className={styles.card}>
            <h3 className={styles.title}>{demoCopy.roles[role].title}</h3>
            <p className={styles.tagline}>{demoCopy.roles[role].tagline}</p>

            {compact ? null : (
              <ul className={styles.list}>
                {demoCopy.roles[role].sees.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <Button
              type='button'
              className={styles.button}
              isLoading={session.creatingRole === role}
              disabled={session.isBusy || isWaiting}
              aria-busy={session.creatingRole === role}
              onClick={() => session.createSession(role, from)}
            >
              {buttonLabel(role)}
            </Button>
          </article>
        ))}
      </div>

      <p className={styles.status} role='status' aria-live='polite'>
        {status}
      </p>
      {session.error && !session.isBusy ? (
        <p className={styles.error} role='alert'>
          {extractErrorMessage(session.error, demoCopy.errors.generic)}
        </p>
      ) : null}
    </div>
  );
};

export { DemoRoleCards };
