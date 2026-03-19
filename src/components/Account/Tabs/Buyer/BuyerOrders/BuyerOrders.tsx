import { useSearchParams } from 'react-router-dom';
import { BuyerOrdersList } from './BuyerOrdersList/BuyerOrdersList';
import BuyerOrder from './BuyerOrder/BuyerOrder';
import { mockOrders } from '@/data/ordersData';
import styles from './BuyerOrders.module.css';

const BuyerOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrderId = searchParams.get('orderId');

  const handleOrderSelect = (orderId: string) => {
    setSearchParams((prev) => {
      prev.set('orderId', orderId);
      return prev;
    });
  };

  const handleBackToList = () => {
    setSearchParams((prev) => {
      prev.delete('orderId');
      return prev;
    });
  };

  return (
    <div className={styles.BuyerOrders}>
      {selectedOrderId ? (
        <BuyerOrder orderId={selectedOrderId} onBack={handleBackToList} />
      ) : (
        <>
          <h3 className={styles.title}>My orders</h3>
          <p className={styles.description}>
            List of your orders since registration
          </p>
          <BuyerOrdersList
            orders={mockOrders}
            onOrderClick={handleOrderSelect}
          />
        </>
      )}
    </div>
  );
};

export default BuyerOrders;
