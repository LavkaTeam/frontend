import { useAdminOrders } from '@/hooks/useAdmin';
import type {
  AdminOrderListItem,
  AdminOrderStatus,
  AdminPaymentStatus,
} from '@/types/admin';
import { formatPaymentMethod } from '@/features/account/orders';
import { extractErrorMessage } from '@/utils/error';

import {
  formatDate,
  formatMoney,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from '../model/adminDisplay';
import {
  ADMIN_PAGE_SIZE,
  useListSearchParams,
} from '../model/useListSearchParams';
import {
  FilterBar,
  FilterChip,
  FilterDate,
  FilterSearch,
  FilterSelect,
} from '../shared/AdminFilters/AdminFilters';
import { AdminPageHeader } from '../shared/AdminPageHeader/AdminPageHeader';
import {
  AdminTable,
  type AdminTableColumn,
} from '../shared/AdminTable/AdminTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

import styles from './AdminOrders.module.css';

const FILTER_KEYS = [
  'status',
  'paymentStatus',
  'q',
  'from',
  'to',
  'sellerId',
  'buyerId',
] as const;

const Party = ({
  company,
  name,
  email,
}: {
  company?: string;
  name?: string;
  email?: string;
}) => (
  <div className={styles.party}>
    <span className={styles.partyName}>{company || name || '—'}</span>
    {email ? <span className={styles.muted}>{email}</span> : null}
  </div>
);

const COLUMNS: AdminTableColumn<AdminOrderListItem>[] = [
  {
    key: 'order',
    header: 'Order',
    width: '16%',
    render: (order) => (
      <div className={styles.party}>
        <span className={styles.orderNumber}>#{order.orderNumber}</span>
        <span className={styles.muted}>{formatDate(order.createdAt)}</span>
      </div>
    ),
  },
  {
    key: 'buyer',
    header: 'Buyer',
    width: '23%',
    render: (order) => (
      <Party
        company={order.buyerCompany}
        name={order.buyerName}
        email={order.buyerEmail}
      />
    ),
  },
  {
    key: 'seller',
    header: 'Seller',
    width: '19%',
    render: (order) => (
      <Party company={order.sellerCompany} name={order.sellerName} />
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: '24%',
    render: (order) => {
      const status = ORDER_STATUS[order.orderStatus];
      const payment = PAYMENT_STATUS[order.paymentStatus];

      return (
        <div className={styles.pills}>
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          <StatusBadge
            tone={payment.tone}
            title={formatPaymentMethod(order.paymentMethod)}
          >
            {payment.label}
          </StatusBadge>
        </div>
      );
    },
  },
  {
    key: 'total',
    header: 'Total',
    width: '18%',
    render: (order) => (
      <div className={styles.total}>
        <span className={styles.amount}>
          {formatMoney(order.summary.grandTotal)}
        </span>
        <span className={styles.muted}>
          {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
        </span>
      </div>
    ),
  },
];

const AdminOrders = () => {
  const {
    filters,
    page,
    apiPage,
    setFilter,
    setPage,
    clearFilters,
    hasFilters,
  } = useListSearchParams(FILTER_KEYS);

  const ordersQuery = useAdminOrders({
    status: (filters.status || undefined) as AdminOrderStatus | undefined,
    paymentStatus: (filters.paymentStatus || undefined) as
      AdminPaymentStatus | undefined,
    q: filters.q || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
    sellerId: filters.sellerId || undefined,
    buyerId: filters.buyerId || undefined,
    page: apiPage,
    size: ADMIN_PAGE_SIZE,
  });
  const data = ordersQuery.data;

  return (
    <>
      <AdminPageHeader
        title='Orders'
        description='All marketplace orders. Read-only: buyers and sellers manage their orders themselves.'
      />

      <FilterBar hasFilters={hasFilters} onClear={clearFilters}>
        <FilterSearch
          label='Search'
          value={filters.q}
          placeholder='Order, company or email'
          onChange={(value) => setFilter('q', value)}
        />
        <FilterSelect
          label='Status'
          value={filters.status}
          onChange={(value) => setFilter('status', value)}
          options={Object.entries(ORDER_STATUS).map(([value, meta]) => ({
            value,
            label: meta.label,
          }))}
        />
        <FilterSelect
          label='Payment'
          value={filters.paymentStatus}
          onChange={(value) => setFilter('paymentStatus', value)}
          options={Object.entries(PAYMENT_STATUS).map(([value, meta]) => ({
            value,
            label: meta.label,
          }))}
        />
        <FilterDate
          label='From'
          value={filters.from}
          max={filters.to || undefined}
          onChange={(value) => setFilter('from', value)}
        />
        <FilterDate
          label='To'
          value={filters.to}
          min={filters.from || undefined}
          onChange={(value) => setFilter('to', value)}
        />
        {filters.sellerId ? (
          <FilterChip
            label='One seller'
            onRemove={() => setFilter('sellerId', '')}
          />
        ) : null}
        {filters.buyerId ? (
          <FilterChip
            label='One buyer'
            onRemove={() => setFilter('buyerId', '')}
          />
        ) : null}
      </FilterBar>

      <AdminTable
        columns={COLUMNS}
        rows={data?.content ?? []}
        getRowKey={(order) => order.id}
        getRowHref={(order) => `/admin/orders/${order.id}`}
        isLoading={ordersQuery.isLoading}
        isFetching={ordersQuery.isFetching}
        error={
          ordersQuery.isError
            ? extractErrorMessage(ordersQuery.error, 'Could not load orders.')
            : undefined
        }
        density='comfortable'
        emptyTitle='No orders found'
        emptyText={hasFilters ? 'Try other filters or clear them.' : undefined}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
      />
    </>
  );
};

export default AdminOrders;
