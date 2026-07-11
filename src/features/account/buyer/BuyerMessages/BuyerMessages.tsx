import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';
import { EmptyMessagesIcon } from '@/components/ui/icons/EmptyMessagesIcon';
import styles from './BuyerMessages.module.css';

const BuyerMessages = () => {
  return (
    <div className={styles.buyerMessages}>
      <div>
        <HeadingH3>Chats with suppliers</HeadingH3>
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

export default BuyerMessages;
