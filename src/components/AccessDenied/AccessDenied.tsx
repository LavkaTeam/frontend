import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

import styles from './AccessDenied.module.css';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className='container'>
      <div className={styles.box}>
        <h3 className={styles.title}>Access denied</h3>
        <p className={styles.text}>
          Your account does not have permission to view this page.
        </p>
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
