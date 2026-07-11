import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import styles from './BuyerSubscriptions.module.css';
import { Button } from '@/components/ui/Button/Button';
import { updateUser } from '@/api/user';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { SelectSubscription } from './SelectSubscription/SelectSubscription';
import { subscriptionsData } from '@/data/subscriptionsData';
import type { Subscriptions } from '@/types/user';

const subscriptionFieldMap = {
  news: 'receiveNews',
  offers: 'receivePersonalizedOffers',
  updates: 'receiveOrderStatusUpdates',
  discounts: 'over40Percent',
} as const;

const getSelectedSubscriptions = (
  subscriptions: Subscriptions | undefined,
): string[] =>
  Object.entries(subscriptionFieldMap).reduce<string[]>((selected, [id, key]) => {
    if (subscriptions?.[key]) {
      selected.push(id);
    }

    return selected;
  }, []);

const buildSubscriptionsPayload = (selectedSubscriptions: string[]) =>
  Object.entries(subscriptionFieldMap).reduce<Subscriptions>(
    (payload, [id, key]) => {
      payload[key] = selectedSubscriptions.includes(id);
      return payload;
    },
    {},
  );

const BuyerSubscriptions = () => {
  const { data: user, error } = useUser();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const initialSelectedSubscriptions = useMemo(
    () => getSelectedSubscriptions(user?.subscriptions),
    [user?.subscriptions],
  );
  const isDirty =
    JSON.stringify([...selectedSubscriptions].sort()) !==
    JSON.stringify([...initialSelectedSubscriptions].sort());

  useEffect(() => {
    if (user) {
      setSelectedSubscriptions(initialSelectedSubscriptions);
    }
  }, [initialSelectedSubscriptions, user]);

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
      await updateUser(user.id, {
        subscriptions: buildSubscriptionsPayload(selectedSubscriptions),
      });
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      showToast('Subscriptions updated successfully', 'success');
    } catch (err) {
      console.error('Failed to update subscriptions:', err);
      showToast('Failed to update subscriptions', 'error');
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
          onToggle={() => handleSubscriptionToggle(subscription.id)}
        />
      ))}

      <div className={styles.button}>
        <Button onClick={handleSave} disabled={!isDirty} isLoading={isLoading}>
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default BuyerSubscriptions;
