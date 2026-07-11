import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';
import { EmptyMessagesIcon } from '@/components/ui/icons/EmptyMessagesIcon';

import styles from './SellerMessages.module.css';

const SellerMessages = () => {
  return (
    <div className={styles.sellerMessages}>
      <div>
        <HeadingH3>Chats with customers</HeadingH3>
        <Space height='32px' />
      </div>
      <Space height='32px' />
      <div className={styles.emptyState}>
        <EmptyMessagesIcon />
        <Space height='16px' />
        <p>We’re working on Messages - coming soon...</p>
      </div>
    </div>
  );
};

export default SellerMessages;
