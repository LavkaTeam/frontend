import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useAdminBlockProduct,
  useAdminProducts,
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

type ProductDialog = {
  kind: 'block' | 'unblock';
  item: AdminProductListItem;
} | null;

// The reason is not printed in the table: it shows on hover or focus.
const BlockedBadge = ({ reason }: { reason?: string }) => {
  const badge = <StatusBadge tone='burgundy'>Blocked</StatusBadge>;

  return reason ? (
    <Tooltip content={<>Blocked by a moderator: {reason}</>}>{badge}</Tooltip>
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

  const openDialog = (
    kind: 'block' | 'unblock',
    item: AdminProductListItem,
  ) => {
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

        return (
          <div className={styles.stack}>
            <div className={styles.pills}>
              <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
              {product.adminBlocked ? (
                <BlockedBadge reason={product.moderationReason} />
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
      render: (item) =>
        item.product.adminBlocked ? (
          <div className={styles.actions}>
            <Button
              type='button'
              variant='secondary'
              onClick={() => openDialog('unblock', item)}
            >
              Unblock
            </Button>
          </div>
        ) : (
          <div className={styles.actions}>
            <Button
              type='button'
              variant='secondary'
              onClick={() => openDialog('block', item)}
            >
              Block
            </Button>
          </div>
        ),
    },
  ];

  const current = dialog?.item;
  const productName = current?.product.name ?? '';

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
        description='Moderate the catalog. A blocked product is hidden and the seller cannot publish it again until you unblock it.'
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
