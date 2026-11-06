import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';

import { demoCopy } from '../../model/demoCopy';
import { DemoRoleCards } from '../DemoRoleCards/DemoRoleCards';

import styles from './DemoHomeCta.module.css';

// Home page, demo only: the way into the sandbox for a visitor who has none.
const DemoHomeCta = () => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) return null;

  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{demoCopy.homeCta.title}</h2>
        <p className={styles.text}>{demoCopy.homeCta.text}</p>
      </div>
      <DemoRoleCards compact />
    </section>
  );
};

export default DemoHomeCta;
