import { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

import { isDemoMode } from '@/features/demo/config';

import styles from './AccessDenied.module.css';

// Demo deployment only; in production the import is dropped from the bundle.
const DemoAdminHint = isDemoMode
  ? lazy(() => import('@/features/demo/components/DemoHint/DemoAdminHint'))
  : null;

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className='container'>
      <div className={styles.box}>
        <h3 className={styles.title}>Access denied</h3>
        <p className={styles.text}>
          Your account does not have permission to view this page.
        </p>
        {DemoAdminHint && window.location.pathname.startsWith('/admin') ? (
          <Suspense fallback={null}>
            <DemoAdminHint />
          </Suspense>
        ) : null}
        <div className={styles.actions}>
          <Button type='button' onClick={() => navigate('/account')}>
            Go to my account
          </Button>
          <Button
            type='button'
            variant='secondary'
            onClick={() => navigate('/products')}
          >
            Back to catalog
          </Button>
        </div>
      </div>
    </div>
  );
};

export { AccessDenied };
