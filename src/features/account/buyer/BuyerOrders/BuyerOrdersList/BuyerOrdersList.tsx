import React from 'react';
import type { OrderSummaryListItemDto } from '@/types/order';
import {
  formatCurrency,
  formatOrderDate,
  formatOrderStatus,
  formatPaymentStatus,
} from '../../../orders/model/orderDisplay';

import styles from './BuyerOrdersList.module.css';

interface BuyerOrdersListProps {
  orders: OrderSummaryListItemDto[];
  onOrderClick: (orderId: string) => void;
}

const BuyerOrdersList: React.FC<BuyerOrdersListProps> = ({
  orders,
  onOrderClick,
}) => {
  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h4>No orders found</h4>
        <p>Try another filter or come back after your next purchase.</p>
      </div>
    );
  }

  return (
    <div className={styles.ordersList}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th>Order Number</th>
              <th>Date</th>
              <th>Price</th>
              <th>Payment</th>
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
                  {formatOrderDate(order.createdAt)}
                </td>
                <td className={styles.cellWithBorder}>
                  {formatCurrency(order.summary.grandTotal)}
                </td>
                <td className={styles.cellWithBorder}>
                  <span
                    className={`${styles.paymentStatus} ${
                      styles[`payment${order.paymentStatus}`]
                    }`}
                  >
                    {formatPaymentStatus(order.paymentStatus)}
                  </span>
                </td>
                <td className={styles.cellWithBorder}>
                  <span
                    className={`${styles.status} ${
                      styles[order.orderStatus.toLowerCase()]
                    }`}
                  >
                    {formatOrderStatus(order.orderStatus)}
                  </span>
                </td>
                <td>
                  <button
                    type='button'
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
