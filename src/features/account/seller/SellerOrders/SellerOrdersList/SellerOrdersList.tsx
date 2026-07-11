import {
  formatOrderStatus,
  formatPaymentStatus,
} from '../../../orders/model/orderDisplay';
import { type SellerOrderListItem } from './SellerOrderRow/SellerOrderRow';
import type { SortConfig } from '@/hooks/useTableSort';
import styles from './SellerOrdersList.module.css';

interface SellerOrdersListProps {
  orders: SellerOrderListItem[];
  sortConfig: SortConfig<SellerOrderListItem> | null;
  requestSort: (key: keyof SellerOrderListItem) => void;
  onOrderClick: (orderId: string) => void;
  formatPrice: (value: number) => string;
}

const SortArrow = ({
  isActive,
  isDesc,
}: {
  isActive: boolean;
  isDesc: boolean;
}) => (
  <svg
    className={`${styles.sortArrow} ${isActive ? styles.sortArrowActive : ''} ${isActive && !isDesc ? styles.sortArrowAsc : ''}`}
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='6 9 12 15 18 9'></polyline>
  </svg>
);

export const SellerOrdersList = ({
  orders,
  sortConfig,
  requestSort,
  onOrderClick,
  formatPrice,
}: SellerOrdersListProps) => {
  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h4>No orders found</h4>
        <p>Try another filter or check back after new customer requests.</p>
      </div>
    );
  }

  const renderSortableHeader = (
    label: string,
    key: keyof SellerOrderListItem,
  ) => {
    const isActive = sortConfig?.key === key;
    const isDesc = sortConfig?.direction === 'desc';

    return (
      <th className={styles.headerCell} onClick={() => requestSort(key)}>
        <span>{label}</span>
        <SortArrow isActive={isActive} isDesc={isDesc} />
      </th>
    );
  };

  return (
    <div className={styles.ordersList}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              {renderSortableHeader('Order Number', 'orderNumber')}
              {renderSortableHeader('Date', 'date')}
              {renderSortableHeader('Price', 'price')}
              <th
                className={`${styles.headerCell} ${styles.headerCellDisabled}`}
              >
                <span>Payment</span>
              </th>
              {renderSortableHeader('Order Status', 'status')}
              <th
                className={`${styles.headerCell} ${styles.headerCellDisabled}`}
              >
                <span>Details</span>
              </th>
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
                <td className={styles.cellWithBorder}>{order.date}</td>
                <td className={styles.cellWithBorder}>
                  {formatPrice(order.price)}
                </td>
                <td className={styles.cellWithBorder}>
                  <div className={styles.paymentCell}>
                    <span
                      className={`${styles.paymentStatus} ${
                        styles[`payment${order.paymentStatus}`]
                      }`}
                    >
                      {formatPaymentStatus(order.paymentStatus)}
                    </span>
                  </div>
                </td>
                <td className={styles.cellWithBorder}>
                  <span
                    className={`${styles.status} ${
                      styles[order.status.toLowerCase()]
                    }`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                </td>
                <td>
                  <button
                    type='button'
                    className={styles.detailsButton}
                    onClick={(event) => {
                      event.stopPropagation();
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
