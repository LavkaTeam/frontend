import { useState, useEffect } from 'react';
import styles from './BuyerSubscriptions.module.css';
import { Button } from '@/components/ui/Button/Button';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';
import { SelectSubscription } from './SelectSubscription/SelectSubscription';
import { subscriptionsData } from '@/data/subscriptionsData';

const BuyerSubscriptions = () => {
  const { data: user, error } = useUser();
  const { toasts, showToast } = useToast();
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  // 1. Завантажуємо налаштування з localStorage при вході
  useEffect(() => {
    if (user) {
      // Використовуємо унікальний ключ для кожного юзера, щоб налаштування не плутались
      const storageKey = `user_subscriptions_${user.id}`;
      const savedSubs = localStorage.getItem(storageKey);

      if (savedSubs) {
        setSelectedSubscriptions(JSON.parse(savedSubs));
      } else {
        setSelectedSubscriptions([]);
      }
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

    // 2. Імітуємо затримку мережі (щоб виглядало як реальний запит)
    setTimeout(() => {
      try {
        const storageKey = `user_subscriptions_${user.id}`;
        localStorage.setItem(storageKey, JSON.stringify(selectedSubscriptions));

        // Показуємо успішний тост
        showToast('Subscriptions updated successfully', 'success');
      } catch (err) {
        console.error('Failed to save locally:', err);
        showToast('Failed to update subscriptions', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 800); // 800мс затримки для реалістичності
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
          onToggle={() => handleSubscriptionToggle(subscription.id)}
        />
      ))}

      <div className={styles.button}>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className={styles.toastContainer}>
        {toasts &&
          toasts.map((toast: any) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => {}}
            />
          ))}
      </div>
    </div>
  );
};

export default BuyerSubscriptions;
