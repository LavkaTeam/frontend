import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useAdminApproveProduct,
  useAdminBlockProduct,
  useAdminProducts,
  useAdminRejectProduct,
  useAdminUnblockProduct,
} from '@/hooks/useAdmin';
import type { AdminProductListItem } from '@/types/admin';
import type { ProductStatus } from '@/types/productCard';
import { extractErrorMessage } from '@/utils/error';

import { formatMoney, PRODUCT_STATUS } from '../model/adminDisplay';
import {
  getAdminActionError,
  useAdminFeedback,
} from '../model/useAdminFeedback';
import {
  ADMIN_PAGE_SIZE,
  useListSearchParams,
} from '../model/useListSearchParams';
import { AdminDialog, ReasonDialog } from '../shared/AdminDialog/AdminDialog';
import {
  FilterBar,
  FilterChip,
  FilterSearch,
  FilterSelect,
} from '../shared/AdminFilters/AdminFilters';
import { AdminPageHeader } from '../shared/AdminPageHeader/AdminPageHeader';
import {
  AdminTable,
  type AdminTableColumn,
} from '../shared/AdminTable/AdminTable';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { StatusBadge } from '@/components/ui/StatusBadge';

import styles from './AdminProducts.module.css';

const FILTER_KEYS = ['status', 'blocked', 'q', 'sellerId'] as const;

type ProductDialogKind = 'block' | 'unblock' | 'approve' | 'reject';
type ProductDialog = {
  kind: ProductDialogKind;
  item: AdminProductListItem;
} | null;

// The reason is not printed in the table: it shows on hover or focus.
const ReasonBadge = ({ label, reason }: { label: string; reason?: string }) => {
  const badge = <StatusBadge tone='burgundy'>{label}</StatusBadge>;

  return reason ? (
    <Tooltip
      content={
        <>
          {label}: {reason}
        </>
      }
    >
      {badge}
    </Tooltip>
  ) : (
    badge
  );
};

const AdminProducts = () => {
  const {
    filters,
    page,
    apiPage,
    setFilter,
    setPage,
    clearFilters,
    hasFilters,
  } = useListSearchParams(FILTER_KEYS);
  const notify = useAdminFeedback();
  const approve = useAdminApproveProduct();
  const reject = useAdminRejectProduct();
  const block = useAdminBlockProduct();
  const unblock = useAdminUnblockProduct();
  const [dialog, setDialog] = useState<ProductDialog>(null);
  const [actionError, setActionError] = useState('');

  const productsQuery = useAdminProducts({
    status: (filters.status || undefined) as ProductStatus | undefined,
    blocked: filters.blocked ? filters.blocked === 'true' : undefined,
    q: filters.q || undefined,
    sellerId: filters.sellerId || undefined,
    page: apiPage,
    size: ADMIN_PAGE_SIZE,
  });
  const data = productsQuery.data;

  const openDialog = (kind: ProductDialogKind, item: AdminProductListItem) => {
    setActionError('');
    setDialog({ kind, item });
  };
  const closeDialog = () => setDialog(null);

  const columns: AdminTableColumn<AdminProductListItem>[] = [
    {
      key: 'product',
      header: 'Product',
      width: '31%',
      render: ({ product }) => (
        <div className={styles.product}>
          {product.mainImage?.url ? (
            <img
              src={product.mainImage.url}
              alt=''
              className={styles.thumb}
              loading='lazy'
            />
          ) : (
            <span className={styles.thumb} aria-hidden='true' />
          )}
          <div className={styles.productText}>
            <Link to={`/product/${product.id}`} className={styles.productName}>
              {product.name}
            </Link>
            <span className={styles.muted}>
              {[product.producer, product.volume ? `${product.volume} L` : '']
                .filter(Boolean)
                .join(' · ')}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'seller',
      header: 'Seller',
      width: '21%',
      render: (item) => (
        <div className={styles.stack}>
          <Link
            to={`/admin/users/${item.sellerId}`}
            className={styles.sellerLink}
          >
            {item.sellerCompany || 'Seller'}
          </Link>
          <span className={styles.muted}>{item.sellerEmail}</span>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price / stock',
      width: '14%',
      render: ({ product }) => (
        <div className={styles.stack}>
          <span className={styles.price}>{formatMoney(product.price)}</span>
          <span className={styles.muted}>{product.quantity} in stock</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '20%',
      render: ({ product }) => {
        const meta = PRODUCT_STATUS[product.status];
        const isRejected = product.moderationStatus === 'REJECTED';

        return (
          <div className={styles.stack}>
            <div className={styles.pills}>
              {isRejected ? (
                // A rejected product is hidden; "Rejected" says more.
                <ReasonBadge
                  label='Rejected'
                  reason={product.moderationReason}
                />
              ) : (
                <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
              )}
              {product.adminBlocked ? (
                <ReasonBadge
                  label='Blocked'
                  reason={product.moderationReason}
                />
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '14%',
      render: (item) => {
        const { product } = item;
        const inQueue =
          product.status === 'UNDER_REVIEW' && !product.adminBlocked;

        return (
          <div className={styles.actions}>
            {inQueue ? (
              <>
                <Button
                  type='button'
                  onClick={() => openDialog('approve', item)}
                >
                  Approve
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => openDialog('reject', item)}
                >
                  Reject
                </Button>
              </>
            ) : product.adminBlocked ? (
              <Button
                type='button'
                variant='secondary'
                onClick={() => openDialog('unblock', item)}
              >
                Unblock
              </Button>
            ) : (
              <Button
                type='button'
                variant='secondary'
                onClick={() => openDialog('block', item)}
              >
                Block
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const current = dialog?.item;
  const productName = current?.product.name ?? '';

  const handleApprove = () => {
    if (!current) return;
    approve.mutate(current.product.id, {
      onSuccess: ({ emailSent }) => {
        closeDialog();
        notify(
          `“${productName}” is approved and listed in the catalog.`,
          emailSent,
        );
      },
      onError: (error) => setActionError(getAdminActionError(error)),
    });
  };

  const handleReject = (reason: string) => {
    if (!current) return;
    reject.mutate(
      { productId: current.product.id, reason },
      {
        onSuccess: ({ emailSent }) => {
          closeDialog();
          notify(
            `“${productName}” is rejected. The seller can edit it and send it again.`,
            emailSent,
          );
        },
        onError: (error) => setActionError(getAdminActionError(error)),
      },
    );
  };

  const handleBlock = (reason: string) => {
    if (!current) return;
    block.mutate(
      { productId: current.product.id, reason },
      {
        onSuccess: ({ emailSent }) => {
          closeDialog();
          notify(
            `“${productName}” is blocked and hidden from the catalog.`,
            emailSent,
          );
        },
        onError: (error) => setActionError(getAdminActionError(error)),
      },
    );
  };

  const handleUnblock = () => {
    if (!current) return;
    unblock.mutate(current.product.id, {
      onSuccess: ({ emailSent }) => {
        closeDialog();
        notify(
          `“${productName}” is unblocked. It stays hidden until the seller activates it.`,
          emailSent,
        );
      },
      onError: (error) => setActionError(getAdminActionError(error)),
    });
  };

  return (
    <>
      <AdminPageHeader
        title='Products'
        description='Review new and edited products, and moderate the catalog. A blocked product is hidden and the seller cannot publish it again until you unblock it.'
      />

      <FilterBar hasFilters={hasFilters} onClear={clearFilters}>
        <FilterSearch
          label='Search'
          value={filters.q}
          placeholder='Name, producer or SKU'
          onChange={(value) => setFilter('q', value)}
        />
        <FilterSelect
          label='Status'
          value={filters.status}
          onChange={(value) => setFilter('status', value)}
          options={Object.entries(PRODUCT_STATUS).map(([value, meta]) => ({
            value,
            label: meta.label,
          }))}
        />
        <FilterSelect
          label='Moderation'
          value={filters.blocked}
          onChange={(value) => setFilter('blocked', value)}
          options={[
            { value: 'true', label: 'Blocked' },
            { value: 'false', label: 'Not blocked' },
          ]}
        />
        {filters.sellerId ? (
          <FilterChip
            label='One seller'
            onRemove={() => setFilter('sellerId', '')}
          />
        ) : null}
      </FilterBar>

      <AdminTable
        columns={columns}
        rows={data?.content ?? []}
        getRowKey={(item) => item.product.id}
        isLoading={productsQuery.isLoading}
        isFetching={productsQuery.isFetching}
        error={
          productsQuery.isError
            ? extractErrorMessage(
                productsQuery.error,
                'Could not load products.',
              )
            : undefined
        }
        density='comfortable'
        emptyTitle={
          filters.blocked === 'true'
            ? 'No blocked products'
            : 'No products found'
        }
        emptyText={hasFilters ? 'Try other filters or clear them.' : undefined}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
      />

      <AdminDialog
        isOpen={dialog?.kind === 'approve'}
        icon='success'
        title={`Approve “${productName}”?`}
        description='The product becomes active and appears in the catalog. The seller is notified by email.'
        confirmLabel='Approve'
        isBusy={approve.isPending}
        error={actionError}
        onConfirm={handleApprove}
        onClose={closeDialog}
      />

      <ReasonDialog
        isOpen={dialog?.kind === 'reject'}
        icon='error'
        tone='danger'
        title={`Reject “${productName}”?`}
        description='The product stays hidden. The seller sees the reason, edits the product and sends it for review again.'
        label='Reason for the seller'
        placeholder='e.g. The description does not match the product on the photos.'
        minLength={10}
        maxLength={500}
        confirmLabel='Reject product'
        isBusy={reject.isPending}
        error={actionError}
        onConfirm={handleReject}
        onClose={closeDialog}
      />

      <ReasonDialog
        isOpen={dialog?.kind === 'block'}
        icon='error'
        tone='danger'
        title={`Block “${productName}”?`}
        description='The product is hidden from the catalog and the seller cannot activate it until you unblock it.'
        label='Reason for the seller'
        placeholder='e.g. The product photos show a different brand than the title.'
        minLength={10}
        maxLength={500}
        confirmLabel='Block product'
        isBusy={block.isPending}
        error={actionError}
        onConfirm={handleBlock}
        onClose={closeDialog}
      />

      <AdminDialog
        isOpen={dialog?.kind === 'unblock'}
        icon='success'
        title={`Unblock “${productName}”?`}
        description={
          <>
            {current?.product.moderationReason ? (
              <>Blocked because: “{current.product.moderationReason}”. </>
            ) : null}
            The block is removed, but the product stays hidden until the seller
            activates it. The seller is notified by email.
          </>
        }
        confirmLabel='Unblock'
        isBusy={unblock.isPending}
        error={actionError}
        onConfirm={handleUnblock}
        onClose={closeDialog}
      />
    </>
  );
};

export default AdminProducts;
