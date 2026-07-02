import React from 'react';
import type { OrderResponseDto } from '@/types/order';
import styles from './BuyerOrdersList.module.css';

interface BuyerOrdersListProps {
  orders: OrderResponseDto[];
  onOrderClick: (orderId: string) => void;
}

const BuyerOrdersList: React.FC<BuyerOrdersListProps> = ({
  orders,
  onOrderClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = dateString ? new Date(dateString) : new Date();

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  return (
    <div className={styles.ordersList}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th>Order Number</th>
              <th>Date</th>
              <th>Price</th>
              <th>Order Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={`${order.id}-${index}`}
                className={styles.row}
                onClick={() => onOrderClick(order.id)}
              >
                <td className={styles.cellWithBorder}>{order.orderNumber}</td>
                <td className={styles.cellWithBorder}>
                  {formatDate(order.createdAt)}
                </td>
                <td className={styles.cellWithBorder}>
                  {formatPrice(order.summary.grandTotal)}
                </td>
                <td className={styles.cellWithBorder}>
                  <span
                    className={`${styles.status} ${
                      styles[order.orderStatus.toLowerCase()]
                    }`}
                  >
                    {order.orderStatus.toLowerCase()}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.detailsButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrderClick(order.id);
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { BuyerOrdersList };
