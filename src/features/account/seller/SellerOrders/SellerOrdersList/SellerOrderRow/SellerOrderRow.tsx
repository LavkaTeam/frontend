import type { OrderStatus, PaymentStatus } from '@/types/order';
import styles from './SellerOrderRow.module.css';

export interface SellerOrderListItem {
  id: string;
  orderNumber: string;
  date: string;
  createdAt: string;
  price: number;
  company: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
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

export const SellerOrderRow = ({
  order,
  onOrderClick,
  formatPrice,
}: {
  order: SellerOrderListItem;
  onOrderClick: (orderId: string) => void;
  formatPrice: (value: number) => string;
}) => {
  const formattedStatus =
    order.status.charAt(0) + order.status.slice(1).toLowerCase();

  return (
    <div className={styles.orderRow}>
      <span className={styles.colText}>{order.orderNumber}</span>
      <span className={styles.colText}>{order.date}</span>
      <span className={styles.colText}>{formatPrice(order.price)}</span>
      <span className={styles.colText}>{order.company}</span>

      <div className={styles.colStatus}>
        <div
          className={`${styles.statusBadge} ${getStatusClass(order.status)}`}
        >
          {formattedStatus}
        </div>
      </div>

      <div className={styles.colDetails}>
        <button
          type='button'
          className={styles.detailsLink}
          onClick={() => onOrderClick(order.id)}
        >
          Details
        </button>
      </div>
    </div>
  );
};
