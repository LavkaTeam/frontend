import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterMenu } from '@/components/ui/FilterMenu/FilterMenu';
import { ActiveFiltersBar } from '@/components/ui/ActiveFiltersBar/ActiveFiltersBar';
import { BlockingOverlay } from '@/components/ui/BlockingOverlay';
import { useTableSort } from '@/hooks/useTableSort';
import { FilterIcon } from '@/components/ui/icons/FilterIcon';
import { Pagination } from '@/components/Pagination';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import {
  saveDocumentBlob,
  useDownloadSellerOrdersReport,
  useSellerOrders,
} from '@/hooks/useOrders';
import BuyerOrders from '../../buyer/BuyerOrders/BuyerOrders';
import BuyerOrder from '../../orders/details/BuyerOrder/BuyerOrder';
import { SellerOrdersList } from './SellerOrdersList/SellerOrdersList';
import type { SellerOrderListItem } from './SellerOrdersList/SellerOrderRow/SellerOrderRow';
import {
  ORDER_STATUS_OPTIONS,
  formatCurrency,
  formatOrderDate,
  formatOrderStatus,
  isOrderStatus,
} from '../../orders/model/orderDisplay';
import { SellerOrdersPageSkeleton } from './skeleton';
import styles from './SellerOrders.module.css';

const PAGE_SIZE = 10;
const VIEW_OPTIONS = [
  {
    value: 'sales',
    label: 'Incoming orders',
    description: 'Orders buyers placed to you',
  },
  {
    value: 'purchases',
    label: 'My purchases',
    description: 'Orders you placed as buyer',
  },
] as const;

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const currentView =
    searchParams.get('scope') === 'purchases' ? 'purchases' : 'sales';
  const selectedOrderId = searchParams.get('orderId');
  const shouldLoadSellerOrders =
    currentView === 'sales' && selectedOrderId === null;
  const currentPage = Math.max(1, Number(searchParams.get('page') || '1'));
  const selectedStatuses = (
    searchParams.get('statuses')?.split(',') || searchParams.getAll('status')
  ).filter(isOrderStatus);
  const { data, isLoading, isFetching, isError } = useSellerOrders(
    currentPage - 1,
    PAGE_SIZE,
    selectedStatuses,
    { enabled: shouldLoadSellerOrders },
  );
  const downloadReportMutation = useDownloadSellerOrdersReport();

  useOnClickOutside(filterRef, () => setIsFilterOpen(false));

  const orders = useMemo<SellerOrderListItem[]>(
    () =>
      (data?.content || []).map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        date: formatOrderDate(order.createdAt),
        createdAt: order.createdAt,
        price: order.summary.grandTotal,
        company:
          order.buyerCompany || order.buyerName || order.sellerCompany || '—',
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
      })),
    [data?.content],
  );

  const { sortedData, sortConfig, requestSort } =
    useTableSort<SellerOrderListItem>(orders);

  const updateSearchParams = (
    updater: (params: URLSearchParams) => URLSearchParams,
  ) => {
    setSearchParams((prev) => updater(new URLSearchParams(prev)));
  };

  const handleViewChange = (view: 'sales' | 'purchases') => {
    updateSearchParams((nextParams) => {
      nextParams.set('scope', view);
      nextParams.delete('orderId');
      nextParams.delete('section');
      nextParams.set('page', '1');
      return nextParams;
    });
  };

  const handleOrderSelect = (orderId: string) => {
    updateSearchParams((nextParams) => {
      nextParams.set('orderId', orderId);
      nextParams.delete('section');
      return nextParams;
    });
  };

  const handleBackToList = () => {
    updateSearchParams((nextParams) => {
      nextParams.delete('orderId');
      nextParams.delete('section');
      return nextParams;
    });
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    updateSearchParams((nextParams) => {
      nextParams.set('page', String(page));
      nextParams.delete('orderId');
      nextParams.delete('section');
      return nextParams;
    });
  };

  const toggleStatus = (status: string) => {
    if (!isOrderStatus(status)) return;

    updateSearchParams((nextParams) => {
      const nextStatuses = (
        nextParams.get('statuses')?.split(',') || nextParams.getAll('status')
      ).filter(isOrderStatus);

      nextParams.delete('status');
      nextParams.delete('statuses');

      const updatedStatuses = nextStatuses.includes(status)
        ? nextStatuses.filter((item) => item !== status)
        : [...nextStatuses, status];

      if (updatedStatuses.length > 0) {
        nextParams.set('statuses', updatedStatuses.join(','));
      }

      nextParams.set('page', '1');
      nextParams.delete('orderId');
      nextParams.delete('section');
      return nextParams;
    });
  };

  const handleClearFilters = () => {
    updateSearchParams((nextParams) => {
      nextParams.delete('status');
      nextParams.delete('statuses');
      nextParams.set('page', '1');
      nextParams.delete('orderId');
      nextParams.delete('section');
      return nextParams;
    });
  };

  const handleDownloadReport = async () => {
    if (downloadReportMutation.isPending) return;

    try {
      const result = await downloadReportMutation.mutateAsync(selectedStatuses);
      saveDocumentBlob(result.blob, result.fileName);
    } catch (error) {
      console.error('Failed to download seller orders report', error);
    }
  };

  if (isLoading) {
    return <SellerOrdersPageSkeleton />;
  }

  if (isError) {
    return <div className={styles.subtitle}>Failed to load orders.</div>;
  }

  if (selectedOrderId) {
    return (
      <div className={styles.container}>
        <BuyerOrder
          orderId={selectedOrderId}
          onBack={handleBackToList}
          viewerRole={currentView === 'sales' ? 'SELLER' : 'BUYER'}
        />
      </div>
    );
  }

  if (currentView === 'purchases') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.subtitle}>
            Switch between incoming customer orders and your own purchases.
          </p>
        </div>

        <div className={styles.segmentedControl}>
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.value}
              type='button'
              className={`${styles.segment} ${
                currentView === option.value ? styles.segmentActive : ''
              }`}
              onClick={() => handleViewChange(option.value)}
            >
              <span className={styles.segmentLabel}>{option.label}</span>
              <span className={styles.segmentDescription}>
                {option.description}
              </span>
            </button>
          ))}
        </div>

        <BuyerOrders embedded />
      </div>
    );
  }

  return (
    <div className={styles.container} aria-busy={isFetching}>
      <div className={styles.header}>
        <h1 className={styles.title}>Orders</h1>
        <p className={styles.subtitle}>
          Switch between incoming customer orders and your own purchases.
        </p>
      </div>

      <div className={styles.segmentedControl}>
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.value}
            type='button'
            className={`${styles.segment} ${
              currentView === option.value ? styles.segmentActive : ''
            }`}
            onClick={() => handleViewChange(option.value)}
          >
            <span className={styles.segmentLabel}>{option.label}</span>
            <span className={styles.segmentDescription}>
              {option.description}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filterSection}>
          <div className={styles.filterContainer} ref={filterRef}>
            <button
              type='button'
              className={`${styles.iconButton} ${isFilterOpen ? styles.iconButtonActive : ''}`}
              onClick={() => setIsFilterOpen((prev) => !prev)}
            >
              <FilterIcon />
            </button>
            <FilterMenu
              title='Order Status:'
              isOpen={isFilterOpen}
              options={ORDER_STATUS_OPTIONS.map(formatOrderStatus)}
              selectedOptions={selectedStatuses.map(formatOrderStatus)}
              onToggleOption={(option) => {
                const matchedStatus = ORDER_STATUS_OPTIONS.find(
                  (status) => formatOrderStatus(status) === option,
                );

                if (matchedStatus) {
                  toggleStatus(matchedStatus);
                }
              }}
              onClearFilters={handleClearFilters}
            />
          </div>

          <ActiveFiltersBar
            selectedOptions={selectedStatuses}
            onRemoveOption={toggleStatus}
            onClearAll={handleClearFilters}
          />
        </div>

        <button
          type='button'
          className={styles.downloadButton}
          onClick={handleDownloadReport}
          disabled={downloadReportMutation.isPending}
        >
          <DownloadIcon />
          <span>
            {downloadReportMutation.isPending
              ? 'Downloading report...'
              : 'Download report (.xls)'}
          </span>
        </button>
      </div>

      <BlockingOverlay
        active={isFetching && !isLoading}
        className={styles.listSection}
      >
        <SellerOrdersList
          orders={sortedData}
          sortConfig={sortConfig}
          requestSort={requestSort}
          onOrderClick={handleOrderSelect}
          formatPrice={formatCurrency}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={data?.totalPages || 0}
          onPageChange={handlePageChange}
          noPaddings
          disabled={isFetching && !isLoading}
        />
      </BlockingOverlay>
    </div>
  );
}
