import styles from './SelectSubscription.module.css';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';

interface SelectSubscriptionProps {
  subscription: {
    id: string;
    title: string;
    description: string;
  };
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const SelectSubscription = ({
  subscription,
  isSelected,
  onToggle,
}: SelectSubscriptionProps) => {
  const handleCardClick = () => {
    onToggle(subscription.id);
  };

  return (
    <div
      className={styles.subscriptionItem}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div
        className={styles.checkboxWrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          label=''
          checked={isSelected}
          onChange={() => onToggle(subscription.id)}
        />
      </div>
      <div className={styles.subscriptionContent}>
        <h4 className={styles.subscriptionTitle}>{subscription.title}</h4>
        <p className={styles.subscriptionDescription}>
          {subscription.description}
        </p>
      </div>
    </div>
  );
};

export { SelectSubscription };
