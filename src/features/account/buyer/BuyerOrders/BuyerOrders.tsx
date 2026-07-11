import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BuyerOrdersList } from './BuyerOrdersList/BuyerOrdersList';
import BuyerOrder from '../../orders/details/BuyerOrder/BuyerOrder';
import { BuyerOrdersPageSkeleton } from './skeleton';
import {
  saveDocumentBlob,
  useDownloadMyOrdersReport,
  useMyOrders,
} from '@/hooks/useOrders';
import { Pagination } from '@/components/Pagination';
import { BlockingOverlay } from '@/components/ui/BlockingOverlay';
import { FilterIcon } from '@/components/ui/icons/FilterIcon';
import { FilterMenu } from '@/components/ui/FilterMenu/FilterMenu';
import { ActiveFiltersBar } from '@/components/ui/ActiveFiltersBar/ActiveFiltersBar';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

import {
  ORDER_STATUS_OPTIONS,
  formatOrderStatus,
  isOrderStatus,
} from '../../orders/model/orderDisplay';
import styles from './BuyerOrders.module.css';

const PAGE_SIZE = 10;

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

interface BuyerOrdersProps {
  embedded?: boolean;
}

const BuyerOrders = ({ embedded = false }: BuyerOrdersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const selectedOrderId = searchParams.get('orderId');
  const currentPage = Math.max(1, Number(searchParams.get('page') || '1'));
  const selectedStatuses = (
    searchParams.get('statuses')?.split(',') || searchParams.getAll('status')
  ).filter(isOrderStatus);
  const shouldLoadOrdersList = !selectedOrderId;
  const { data, isLoading, isFetching, isError } = useMyOrders(
    currentPage - 1,
    PAGE_SIZE,
    selectedStatuses,
    { enabled: shouldLoadOrdersList },
  );
  const downloadReportMutation = useDownloadMyOrdersReport();

  useOnClickOutside(filterRef, () => setIsFilterOpen(false));

  const updateSearchParams = (
    updater: (params: URLSearchParams) => URLSearchParams,
  ) => {
    setSearchParams((prev) => updater(new URLSearchParams(prev)));
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
      console.error('Failed to download buyer orders report', error);
    }
  };

  if (selectedOrderId) {
    return (
      <div className={styles.BuyerOrders}>
        <BuyerOrder orderId={selectedOrderId} onBack={handleBackToList} />
      </div>
    );
  }

  if (isLoading) {
    return <BuyerOrdersPageSkeleton />;
  }

  if (isError) {
    return <div className={styles.description}>Failed to load orders.</div>;
  }

  return (
    <div className={styles.BuyerOrders}>
      {!embedded ? (
        <>
          <h3 className={styles.title}>My orders</h3>
          <p className={styles.description}>
            List of your orders since registration
          </p>
        </>
      ) : null}
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
                if (matchedStatus) toggleStatus(matchedStatus);
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
        <BuyerOrdersList
          orders={data?.content || []}
          onOrderClick={handleOrderSelect}
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
};

export default BuyerOrders;
