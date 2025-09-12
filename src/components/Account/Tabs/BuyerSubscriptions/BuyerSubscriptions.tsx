import { useState, useEffect } from 'react';
import styles from './BuyerSubscriptions.module.css';
import { Button } from '@/components/ui/Button/Button';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import Toast from '../Toast/Toast';
import { SelectSubscription } from './SelectSubscription/SelectSubscription';
import { subscriptionsData } from '@/data/subscriptionsData';
import { updateUser } from '@/api/user';

const BuyerSubscriptions = () => {
  const { data: user, error } = useUser();
  const { toasts, showToast } = useToast();
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.subscriptions) {
      setSelectedSubscriptions(user.subscriptions);
    }
  }, [user]);

  const handleSubscriptionToggle = (subscriptionId: string) => {
    setSelectedSubscriptions((prev) => {
      if (prev.includes(subscriptionId)) {
        return prev.filter((id) => id !== subscriptionId);
      } else {
        return [...prev, subscriptionId];
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Оновлюємо тільки підписки, інші дані залишаємо без змін
      const updatedUser = await updateUser(user.id, {
        ...user, // всі поточні дані користувача
        subscriptions: selectedSubscriptions, // оновлені підписки
      });

      showToast('Subscriptions updated successfully', 'success');

      // Оновлюємо дані в кеші вручну (якщо потрібно)
      // Можна використати window.location.reload() або інший спосіб оновлення даних
    } catch (err: any) {
      console.error('Failed to update subscriptions:', err);
      const errorMessage =
        err.message || err.error || 'Failed to update subscriptions';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (error || !user) return null;

  return (
    <div className={styles.BuyerSubscriptions}>
      <h3 className={styles.title}>Subscriptions / Newsletters</h3>
      <p className={styles.description}>Choose what you'd like to receive</p>

      {subscriptionsData.map((subscription) => (
        <SelectSubscription
          key={subscription.id}
          subscription={subscription}
          isSelected={selectedSubscriptions.includes(subscription.id)}
          onToggle={handleSubscriptionToggle}
        />
      ))}

      <div className={styles.button}>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {}}
        />
      ))}
    </div>
  );
};

export default BuyerSubscriptions;
