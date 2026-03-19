import { SellerOrderRow, type Order } from './SellerOrderRow/SellerOrderRow';
import type { SortConfig } from '@/hooks/useTableSort';
import styles from './SellerOrdersList.module.css';

interface SellerOrdersListProps {
  orders: Order[];
  sortConfig: SortConfig<Order> | null;
  requestSort: (key: keyof Order) => void;
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
}: SellerOrdersListProps) => {
  const renderSortableHeader = (label: string, key: keyof Order) => {
    const isActive = sortConfig?.key === key;
    const isDesc = sortConfig?.direction === 'desc';

    return (
      <div className={styles.headerCell} onClick={() => requestSort(key)}>
        <span>{label}</span>
        <SortArrow isActive={isActive} isDesc={isDesc} />
      </div>
    );
  };

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        {renderSortableHeader('Order Number', 'id')}
        {renderSortableHeader('Date', 'date')}
        {renderSortableHeader('Price', 'price')}
        {renderSortableHeader('Company', 'company')} {/* ЗМІНЕНО НА COMPANY */}
        {renderSortableHeader('Order Status', 'status')}
        <div className={`${styles.headerCell} ${styles.headerCellDisabled}`}>
          <span>Details</span>
        </div>
      </div>

      <div className={styles.orderList}>
        {orders.length > 0 ? (
          orders.map((order) => <SellerOrderRow key={order.id} order={order} />)
        ) : (
          <div className={styles.emptyState}>No orders found.</div>
        )}
      </div>
    </div>
  );
};
