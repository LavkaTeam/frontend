import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';

import { DemoRoleCards } from '../components/DemoRoleCards/DemoRoleCards';
import { useDemoSession, DEMO_HOME_ROUTE } from '../hooks/useDemoSession';
import { useDemoTtlHours } from '../hooks/useDemoInfo';
import { demoCopy } from '../model/demoCopy';
import type { DemoRole } from '../types';

import styles from './DemoLanding.module.css';

// /demo: the entrance of the demo deployment.
const DemoLanding = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { data: user } = useUser();
  const ttlHours = useDemoTtlHours();
  const session = useDemoSession();
  const isInSandbox = isAuthenticated && Boolean(user?.demo);

  return (
    <div className='container'>
      <section className={styles.page}>
        <h1 className={styles.title}>{demoCopy.landing.title}</h1>
        <p className={styles.subtitle}>{demoCopy.landing.subtitle}</p>

        {isInSandbox ? (
          <div className={styles.actions}>
            <Button type='button' onClick={() => navigate(DEMO_HOME_ROUTE)}>
              {demoCopy.landing.continue}
            </Button>
            <Button
              type='button'
              variant='secondary'
              isLoading={session.isResetting}
              disabled={session.isBusy || session.cooldownSeconds > 0}
              onClick={() => session.reset(user?.role as DemoRole)}
            >
              {session.cooldownSeconds > 0
                ? demoCopy.cta.retryIn(session.cooldownSeconds)
                : demoCopy.landing.startFresh}
            </Button>
          </div>
        ) : (
          <DemoRoleCards />
        )}

        <p className={styles.note}>{demoCopy.landing.sandboxNote(ttlHours)}</p>
        <p className={styles.honesty}>{demoCopy.landing.honesty}</p>

        <Link to='/products' className={styles.back}>
          {demoCopy.landing.backToCatalog}
        </Link>
      </section>
    </div>
  );
};

export default DemoLanding;
