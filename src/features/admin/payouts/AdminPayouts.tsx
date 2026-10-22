import { useState } from 'react';

import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  useAdminApprovePayout,
  useAdminPayouts,
  useAdminRejectPayout,
} from '@/hooks/useAdmin';
import { useToast } from '@/hooks/useToast';
import type { AdminPayout, AdminPayoutStatus } from '@/types/admin';
import { extractErrorMessage } from '@/utils/error';

import { formatDate, formatMoney, PAYOUT_STATUS } from '../model/adminDisplay';
import {
  getAdminActionError,
  useAdminFeedback,
} from '../model/useAdminFeedback';
import {
  ADMIN_PAGE_SIZE,
  useListSearchParams,
} from '../model/useListSearchParams';
import { ReasonDialog } from '../shared/AdminDialog/AdminDialog';
import {
  FilterBar,
  FilterChip,
  FilterSelect,
} from '../shared/AdminFilters/AdminFilters';
import { AdminPageHeader } from '../shared/AdminPageHeader/AdminPageHeader';
import {
  AdminTable,
  type AdminTableColumn,
} from '../shared/AdminTable/AdminTable';
import { PayoutDetailsDialog } from './PayoutDetailsDialog';

import styles from './AdminPayouts.module.css';

const FILTER_KEYS = ['status', 'sellerId'] as const;

type PayoutDialog = { kind: 'details' | 'reject'; payout: AdminPayout } | null;

const COLUMNS: AdminTableColumn<AdminPayout>[] = [
  {
    key: 'seller',
    header: 'Seller',
    width: '32%',
    render: (payout) => (
      <div className={styles.seller}>
        <span className={styles.sellerName}>
          {payout.sellerCompany || payout.sellerName || 'Seller'}
        </span>
        <span className={styles.muted}>{payout.sellerEmail}</span>
      </div>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    width: '16%',
    render: (payout) => (
      <span className={styles.amount}>
        {formatMoney(payout.amount, payout.currency)}
      </span>
    ),
  },
  {
    key: 'requested',
    header: 'Requested',
    width: '18%',
    render: (payout) => formatDate(payout.createdAt),
  },
  {
    key: 'status',
    header: 'Status',
    width: '20%',
    render: (payout) => {
      const meta = PAYOUT_STATUS[payout.status];

      return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
    },
  },
  {
    key: 'details',
    header: 'Details',
    width: '14%',
    render: () => <span className={styles.detailsLink}>Details</span>,
  },
];

const AdminPayouts = () => {
  const {
    filters,
    page,
    apiPage,
    setFilter,
    setPage,
    clearFilters,
    hasFilters,
  } = useListSearchParams(FILTER_KEYS);
  const { showToast } = useToast();
  const notify = useAdminFeedback();
  const approve = useAdminApprovePayout();
  const reject = useAdminRejectPayout();
  const [dialog, setDialog] = useState<PayoutDialog>(null);
  const [actionError, setActionError] = useState('');

  const payoutsQuery = useAdminPayouts({
    status: (filters.status || undefined) as AdminPayoutStatus | undefined,
    sellerId: filters.sellerId || undefined,
    page: apiPage,
    size: ADMIN_PAGE_SIZE,
  });
  const data = payoutsQuery.data;

  const openDialog = (kind: 'details' | 'reject', payout: AdminPayout) => {
    setActionError('');
    setDialog({ kind, payout });
  };
  const closeDialog = () => setDialog(null);

  const copyToClipboard = async (label: string, value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ''));
      showToast(`${label} copied.`, 'success');
    } catch {
      showToast(`Could not copy the ${label}.`, 'error');
    }
  };

  const current = dialog?.payout;
  const currentAmount = current
    ? formatMoney(current.amount, current.currency)
    : '';
  const currentSeller =
    current?.sellerCompany || current?.sellerName || 'the seller';

  const handleApprove = () => {
    if (!current) return;
    approve.mutate(current.id, {
      onSuccess: ({ emailSent }) => {
        closeDialog();
        notify(
          `Payout of ${currentAmount} to ${currentSeller} is marked as paid.`,
          emailSent,
        );
      },
      onError: (error) => setActionError(getAdminActionError(error)),
    });
  };

  const handleReject = (comment: string) => {
    if (!current) return;
    reject.mutate(
      { payoutId: current.id, comment },
      {
        onSuccess: ({ emailSent }) => {
          closeDialog();
          notify(
            `Payout of ${currentAmount} is rejected and returned to the seller's balance.`,
            emailSent,
          );
        },
        onError: (error) => setActionError(getAdminActionError(error)),
      },
    );
  };

  return (
    <>
      <AdminPageHeader
        title='Payouts'
        description='Seller payout requests. Open a request to see where to send the money and to decide on it.'
      />

      <FilterBar hasFilters={hasFilters} onClear={clearFilters}>
        <FilterSelect
          label='Status'
          value={filters.status}
          onChange={(value) => setFilter('status', value)}
          options={Object.entries(PAYOUT_STATUS).map(([value, meta]) => ({
            value,
            label: meta.label,
          }))}
        />
        {filters.sellerId ? (
          <FilterChip
            label='One seller'
            onRemove={() => setFilter('sellerId', '')}
          />
        ) : null}
      </FilterBar>

      <AdminTable
        columns={COLUMNS}
        rows={data?.content ?? []}
        getRowKey={(payout) => payout.id}
        onRowClick={(payout) => openDialog('details', payout)}
        isLoading={payoutsQuery.isLoading}
        isFetching={payoutsQuery.isFetching}
        error={
          payoutsQuery.isError
            ? extractErrorMessage(payoutsQuery.error, 'Could not load payouts.')
            : undefined
        }
        emptyTitle={
          filters.status === 'PENDING'
            ? 'No payout requests waiting'
            : 'No payouts found'
        }
        emptyText={hasFilters ? 'Try other filters or clear them.' : undefined}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
        minWidth={760}
      />

      <PayoutDetailsDialog
        payout={dialog?.kind === 'details' ? dialog.payout : null}
        isBusy={approve.isPending}
        error={actionError}
        onApprove={handleApprove}
        onReject={() => current && openDialog('reject', current)}
        onCopy={copyToClipboard}
        onClose={closeDialog}
      />

      <ReasonDialog
        isOpen={dialog?.kind === 'reject'}
        icon='error'
        tone='danger'
        title={`Reject the payout of ${currentAmount}?`}
        description="The amount returns to the seller's available balance."
        label='Comment for the seller'
        placeholder='e.g. The IBAN does not match the company name. Please update your bank details.'
        minLength={5}
        maxLength={500}
        confirmLabel='Reject payout'
        isBusy={reject.isPending}
        error={actionError}
        onConfirm={handleReject}
        onClose={() => current && openDialog('details', current)}
      />
    </>
  );
};

export default AdminPayouts;
