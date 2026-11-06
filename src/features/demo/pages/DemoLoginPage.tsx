import { useLocation } from 'react-router-dom';

import { DemoRoleCards } from '../components/DemoRoleCards/DemoRoleCards';
import { demoCopy } from '../model/demoCopy';

import styles from './DemoLanding.module.css';

// /login in the demo: there is no password form, just the two roles. A page
// that sent the visitor here (state.from) is where they return to.
const DemoLoginPage = () => {
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <div className='container'>
      <section className={styles.page}>
        <h1 className={styles.title}>{demoCopy.landing.title}</h1>
        <p className={styles.subtitle}>{demoCopy.landing.loginNote}</p>
        <DemoRoleCards from={from} />
      </section>
    </div>
  );
};

export default DemoLoginPage;
