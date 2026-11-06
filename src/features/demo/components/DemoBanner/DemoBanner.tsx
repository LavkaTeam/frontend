import { Link } from 'react-router-dom';

import { useDemoStatus } from '../../hooks/useDemoStatus';
import { demoCopy } from '../../model/demoCopy';
import { formatTimeLeft, isLowTime } from '../../model/formatTimeLeft';
import { DemoMenu } from '../DemoMenu/DemoMenu';

import styles from './DemoBanner.module.css';

// The strip above the header: tells every visitor that this is a demo, and a
// signed-in visitor also the role, the time left and the demo menu.
const DemoBanner = () => {
  const { isDemoUser, role, msLeft } = useDemoStatus();
  const timeLeft = msLeft === null ? null : formatTimeLeft(msLeft);
  const isLow = msLeft !== null && isLowTime(msLeft);

  return (
    <div className={styles.banner} role='status'>
      <div className={styles.inner}>
        <p className={styles.notice}>
          <strong className={styles.label}>
            <span className={styles.wide}>{demoCopy.banner.title}</span>
            <span className={styles.narrow}>DEMO</span>
          </strong>
          <span className={`${styles.separator} ${styles.wide}`}>·</span>
          <span className={styles.wide}>{demoCopy.banner.notice}</span>
        </p>

        {isDemoUser && role ? (
          <div className={styles.session}>
            <span className={styles.wide}>
              {demoCopy.banner.exploringAs(role)}
            </span>
            {timeLeft ? (
              <span className={`${styles.time} ${isLow ? styles.timeLow : ''}`}>
                <span className={styles.wide}>
                  {demoCopy.banner.deletedIn(timeLeft)}
                </span>
                <span className={styles.narrow}>{timeLeft}</span>
              </span>
            ) : null}
            <DemoMenu role={role} />
          </div>
        ) : (
          <Link to='/demo' className={styles.tryLink}>
            {demoCopy.banner.tryDemo}
          </Link>
        )}
      </div>
    </div>
  );
};

export default DemoBanner;
