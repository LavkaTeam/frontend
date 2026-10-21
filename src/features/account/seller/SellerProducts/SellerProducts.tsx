import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Pagination } from '@/components/Pagination';
import { BlockingOverlay } from '@/components/ui/BlockingOverlay';
import { Button } from '@/components/ui/Button';
import { ActiveFiltersBar } from '@/components/ui/ActiveFiltersBar/ActiveFiltersBar';
import { FilterMenu } from '@/components/ui/FilterMenu/FilterMenu';
import { FilterIcon } from '@/components/ui/icons/FilterIcon';
import { useSellerProducts } from '@/hooks/useProducts';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import type { ProductStatus } from '@/types/productCard';
import { isSellerNotVerifiedError } from '@/utils/error';

import { SellerAddProduct } from './SellerAddProduct/SellerAddProduct';
import { SellerProductsList } from './SellerProductsList/SellerProductsList';
import { SellerProductsPageSkeleton } from './skeleton';
import { SellerVerificationNotice } from '../shared/SellerVerificationNotice/SellerVerificationNotice';
import styles from './SellerProducts.module.css';

const PAGE_SIZE = 10;
const STATUS_OPTIONS: ProductStatus[] = [
  'ACTIVE',
  'UNDER_REVIEW',
  'HIDDEN',
  'ARCHIVED',
];

const formatStatus = (status: ProductStatus) =>
  status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

const isProductStatus = (value: string | null): value is ProductStatus =>
  Boolean(value && STATUS_OPTIONS.includes(value as ProductStatus));

const SellerProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(filterRef, () => setIsFilterOpen(false));

  const currentPage = Math.max(1, Number(searchParams.get('page') || '1'));
  const selectedStatus = searchParams.get('status');
  const statusFilter = isProductStatus(selectedStatus)
    ? selectedStatus
    : undefined;
  const action = searchParams.get('action');
  const productId = searchParams.get('productId') || undefined;
  const isCreating = action === 'new';
  const isEditing = action === 'edit' && Boolean(productId);

  const { products, totalPages, isLoading, isFetching, isError, error } =
    useSellerProducts(currentPage - 1, PAGE_SIZE, statusFilter);

  const updateSearchParams = (
    updater: (params: URLSearchParams) => URLSearchParams,
  ) => {
    setSearchParams((previous) => updater(new URLSearchParams(previous)));
  };

  const handleOpenCreate = () => {
    updateSearchParams((nextParams) => {
      nextParams.set('action', 'new');
      nextParams.delete('productId');
      return nextParams;
    });
  };

  const handleOpenEdit = (id: string) => {
    updateSearchParams((nextParams) => {
      nextParams.set('action', 'edit');
      nextParams.set('productId', id);
      return nextParams;
    });
  };

  const handleCloseEditor = () => {
    updateSearchParams((nextParams) => {
      nextParams.delete('action');
      nextParams.delete('productId');
      return nextParams;
    });
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    updateSearchParams((nextParams) => {
      nextParams.set('page', String(page));
      nextParams.delete('action');
      nextParams.delete('productId');
      return nextParams;
    });
  };

  const toggleStatus = (label: string) => {
    const matchedStatus = STATUS_OPTIONS.find(
      (status) => formatStatus(status) === label,
    );
    if (!matchedStatus) return;

    updateSearchParams((nextParams) => {
      if (nextParams.get('status') === matchedStatus) {
        nextParams.delete('status');
      } else {
        nextParams.set('status', matchedStatus);
      }
      nextParams.set('page', '1');
      nextParams.delete('action');
      nextParams.delete('productId');
      return nextParams;
    });
  };

  const clearFilters = () => {
    updateSearchParams((nextParams) => {
      nextParams.delete('status');
      nextParams.set('page', '1');
      return nextParams;
    });
  };

  if (isCreating || isEditing) {
    return (
      <SellerAddProduct
        mode={isEditing ? 'edit' : 'create'}
        productId={productId}
        onCancel={handleCloseEditor}
        onSuccess={handleCloseEditor}
      />
    );
  }

  if (isLoading) {
    return <SellerProductsPageSkeleton />;
  }

  if (isSellerNotVerifiedError(error)) {
    return (
      <SellerVerificationNotice sectionName='your products'>
        <SellerProductsPageSkeleton />
      </SellerVerificationNotice>
    );
  }

  if (isError) {
    return (
      <div className={styles.feedbackState}>
        <h3>Failed to load products</h3>
        <p>Try refreshing the page or check the connection to the backend.</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer} aria-busy={isFetching}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>My products</h1>
          <p className={styles.subTitle}>
            Add, edit and manage the products available in your seller catalog.
          </p>
        </div>

        <div className={styles.actionBlock}>
          <Button type='button' onClick={handleOpenCreate}>
            Add product
          </Button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filterSection}>
          <div ref={filterRef} className={styles.filterWrapper}>
            <button
              type='button'
              className={`${styles.filterBtn} ${isFilterOpen ? styles.filterBtnActive : ''}`}
              aria-label='Filter products by status'
              onClick={() => setIsFilterOpen((previous) => !previous)}
            >
              <FilterIcon />
            </button>

            <FilterMenu
              title='Product Status:'
              isOpen={isFilterOpen}
              options={STATUS_OPTIONS.map(formatStatus)}
              selectedOptions={statusFilter ? [formatStatus(statusFilter)] : []}
              onToggleOption={toggleStatus}
              onClearFilters={clearFilters}
            />
          </div>

          <ActiveFiltersBar
            selectedOptions={statusFilter ? [formatStatus(statusFilter)] : []}
            onRemoveOption={toggleStatus}
            onClearAll={clearFilters}
          />
        </div>

        {isFetching ? (
          <span className={styles.fetchingLabel}>Updating…</span>
        ) : null}
      </div>

      <BlockingOverlay
        active={isFetching && !isLoading}
        className={styles.listSection}
      >
        <SellerProductsList products={products} onEdit={handleOpenEdit} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          noPaddings
          disabled={isFetching && !isLoading}
        />
      </BlockingOverlay>
    </div>
  );
};

export default SellerProducts;
