import { useState } from 'react';
import { BuyerOrdersList } from './BuyerOrdersList/BuyerOrdersList';
import BuyerOrder from './BuyerOrder/BuyerOrder';
import { mockOrders } from '@/data/ordersData';
import styles from './BuyerOrders.module.css';

const BuyerOrders = () => {
  // Стан: ID вибраного замовлення або null (якщо дивимось список)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Функція, щоб відкрити замовлення
  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  // Функція, щоб повернутися назад до списку
  const handleBackToList = () => {
    setSelectedOrderId(null);
  };

  return (
    <div className={styles.BuyerOrders}>
      {/* Якщо ID вибрано -> показуємо деталі, інакше -> список */}
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
