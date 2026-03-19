import type { OrderStatus } from '@/types/order'; // Переконайся, що шлях правильний
import styles from './SellerOrderRow.module.css';

// Оновлений інтерфейс з company замість customer
export interface Order {
  id: string;
  date: string;
  price: number;
  company: string; // Заміна
  status: OrderStatus; // Заміна на тип
}

const getStatusClass = (status: OrderStatus) => {
  switch (status) {
    case 'NEW':
      return styles.statusNew;
    case 'PROCESSING':
      return styles.statusProcessing;
    case 'SHIPPED':
      return styles.statusShipped;
    case 'DELIVERED':
      return styles.statusDelivered;
    case 'CANCELLED':
      return styles.statusCancelled;
    default:
      return styles.statusNew;
  }
};

export const SellerOrderRow = ({ order }: { order: Order }) => {
  const formattedStatus =
    order.status.charAt(0) + order.status.slice(1).toLowerCase();

  return (
    <div className={styles.orderRow}>
      <span className={styles.colText}>{order.id}</span>
      <span className={styles.colText}>{order.date}</span>
      <span className={styles.colText}>${order.price}</span>
      <span className={styles.colText}>{order.company}</span>

      <div className={styles.colStatus}>
        <div
          className={`${styles.statusBadge} ${getStatusClass(order.status)}`}
        >
          {formattedStatus}
        </div>
      </div>

      <div className={styles.colDetails}>
        <button className={styles.detailsLink}>Details</button>
      </div>
    </div>
  );
};
