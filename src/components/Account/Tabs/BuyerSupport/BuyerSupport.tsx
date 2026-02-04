import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';
import { EmptySupportIcon } from '@/components/ui/icons/EmptySupportIcon';
import styles from './BuyerSupport.module.css';

const BuyerSupport = () => {
  return (
    <div className={styles.BuyerSupport}>
      <div>
        <HeadingH3>Support</HeadingH3>
        <Space height='32px' />
      </div>
      <Space height='32px' />
      <div className={styles.EmptySupport}>
        <EmptySupportIcon />
        <Space height='16px' />
        <p>We’re working on Support - coming soon...</p>
      </div>
    </div>
  );
};

export default BuyerSupport;
