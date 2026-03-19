import { useState, useMemo, useRef, useEffect } from 'react';
import { FilterMenu } from '@/components/ui/FilterMenu/FilterMenu';
import { ActiveFiltersBar } from '@/components/ui/ActiveFiltersBar/ActiveFiltersBar';
import { useTableSort } from '@/hooks/useTableSort';

import { FilterIcon } from '@/components/ui/icons/FilterIcon';
import { SellerOrdersList } from './SellerOrdersList/SellerOrdersList';
import type { Order } from './SellerOrdersList/SellerOrderRow/SellerOrderRow';

// 1. ІМПОРТУЄМО ТВІЙ ТИП
import type { OrderStatus } from '@/types/order';
import styles from './SellerOrders.module.css';

// 2. СТВОРЮЄМО СУВОРИЙ СЛОВНИК СТАТУСІВ
// Record<OrderStatus, OrderStatus> гарантує, що ми не пропустимо ЖОДНОГО статусу з типу!
// Якщо в type OrderStatus додасться 'REFUNDED', тут буде світитися помилка, поки ти його не додаш.
const STATUS_DICTIONARY: Record<OrderStatus, OrderStatus> = {
  NEW: 'NEW',
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

// Витягуємо масив для рендеру меню фільтрів
const ORDER_STATUSES = Object.values(STATUS_DICTIONARY);

const MOCK_ORDERS: Order[] = [
  {
    id: '2054891',
    date: '11.05.2025',
    price: 450,
    company: 'Lavka Team LLC',
    status: 'NEW',
  },
  {
    id: '2054892',
    date: '12.05.2025',
    price: 1250,
    company: 'Silpo Retail',
    status: 'SHIPPED',
  },
  {
    id: '2054893',
    date: '13.05.2025',
    price: 85,
    company: 'Auchan Group',
    status: 'DELIVERED',
  },
];

const DownloadIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
    <polyline points='7 10 12 15 17 10'></polyline>
    <line x1='12' y1='15' x2='12' y2='3'></line>
  </svg>
);

export default function SellerOrders() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Тепер стейт фільтрів строго типізований масивом статусів
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const filteredOrders = useMemo(() => {
    if (selectedStatuses.length === 0) return MOCK_ORDERS;
    return MOCK_ORDERS.filter((order) =>
      selectedStatuses.includes(order.status),
    );
  }, [selectedStatuses]);

  const { sortedData, sortConfig, requestSort } =
    useTableSort<Order>(filteredOrders);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleStatus = (status: string) => {
    const validStatus = status as OrderStatus;
    setSelectedStatuses((prev) =>
      prev.includes(validStatus)
        ? prev.filter((s) => s !== validStatus)
        : [...prev, validStatus],
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Orders</h1>
        <p className={styles.subtitle}>List of orders for your products.</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filterSection}>
          <div className={styles.filterContainer} ref={filterRef}>
            <button
              className={`${styles.iconButton} ${isFilterOpen ? styles.iconButtonActive : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FilterIcon />
            </button>
            <FilterMenu
              title='Order Status:'
              isOpen={isFilterOpen}
              options={Object.values(ORDER_STATUSES).map((status) =>
                status
                  .toLowerCase()
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
              )}
              selectedOptions={selectedStatuses}
              onToggleOption={toggleStatus}
              onClearFilters={() => setSelectedStatuses([])}
            />
          </div>

          <ActiveFiltersBar
            selectedOptions={selectedStatuses}
            onRemoveOption={toggleStatus}
            onClearAll={() => setSelectedStatuses([])}
          />
        </div>

        <button className={styles.downloadButton}>
          <DownloadIcon />
          <span>Download report (.xls)</span>
        </button>
      </div>

      <SellerOrdersList
        orders={sortedData}
        sortConfig={sortConfig}
        requestSort={requestSort}
      />
    </div>
  );
}
