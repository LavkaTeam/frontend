import { Link } from 'react-router-dom';

import { PageNotFoundIcon } from '@/components/ui/icons/PageNotFoundIcon';
import { Button } from '@/components/ui/Button/Button';

import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className='container'>
      <div className={styles.box}>
        <PageNotFoundIcon />
        <h3 className={styles.title}>
          We couldn’t find this page, but we do have something to pour.
        </h3>
        <div className={styles.button}>
          <Link to='/products'>
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
