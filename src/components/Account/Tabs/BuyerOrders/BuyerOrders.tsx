import { useState } from 'react';
import { BuyerOrdersList } from './BuyerOrdersList/BuyerOrdersList';
import BuyerOrder from './BuyerOrder/BuyerOrder';
import { Loader } from '@/components/ui/Loader';
import { useMyOrders } from '@/hooks/useOrders';
import styles from './BuyerOrders.module.css';

const BuyerOrders = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { data, isLoading, isError } = useMyOrders();

  if (isLoading) {
    return <Loader variant='section' />;
  }

  if (isError) {
    return <div className={styles.description}>Failed to load orders.</div>;
  }

  return (
    <div className={styles.BuyerOrders}>
      {selectedOrderId ? (
        <BuyerOrder
          orderId={selectedOrderId}
          onBack={() => setSelectedOrderId(null)}
        />
      ) : (
        <>
          <h3 className={styles.title}>My orders</h3>
          <p className={styles.description}>
            List of your orders since registration
          </p>
          <BuyerOrdersList
            orders={data?.content || []}
            onOrderClick={(orderId) => setSelectedOrderId(orderId)}
          />
        </>
      )}
    </div>
  );
};

export default BuyerOrders;
