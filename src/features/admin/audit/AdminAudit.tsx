import { Link } from 'react-router-dom';

import { useAdminAudit } from '@/hooks/useAdmin';
import type { AdminAuditAction, AdminAuditEntry } from '@/types/admin';
import { extractErrorMessage } from '@/utils/error';

import { AUDIT_ACTION, formatDateTime } from '../model/adminDisplay';
import {
  ADMIN_PAGE_SIZE,
  useListSearchParams,
} from '../model/useListSearchParams';
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
import { StatusBadge } from '@/components/ui/StatusBadge';

import styles from './AdminAudit.module.css';

const FILTER_KEYS = ['action', 'targetId'] as const;

const TARGET_LABELS: Record<string, string> = {
  USER: 'User',
  SELLER: 'Seller',
  PAYOUT: 'Payout',
  PRODUCT: 'Product',
  ORDER: 'Order',
};

// "previousStatus" → "Previous status"
const humanizeKey = (key: string) => {
  const words = key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const formatDetailValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const Target = ({ entry }: { entry: AdminAuditEntry }) => {
  const label = entry.targetLabel || entry.targetId;
  const opensUser =
    entry.targetType === 'USER' || entry.targetType === 'SELLER';

  return (
    <div className={styles.stack}>
      <span className={styles.muted}>
        {TARGET_LABELS[entry.targetType] || entry.targetType}
      </span>
      {opensUser ? (
        <Link
          to={`/admin/users/${entry.targetId}`}
          className={styles.targetLink}
        >
          {label}
        </Link>
      ) : entry.targetType === 'ORDER' ? (
        <Link
          to={`/admin/orders/${entry.targetId}`}
          className={styles.targetLink}
        >
          {label}
        </Link>
      ) : (
        <span className={styles.target}>{label}</span>
      )}
    </div>
  );
};

const Details = ({ details }: { details?: Record<string, unknown> }) => {
  const entries = Object.entries(details ?? {});
  if (entries.length === 0) return <span className={styles.muted}>—</span>;

  return (
    <details className={styles.details}>
      <summary>
        {entries.length} {entries.length === 1 ? 'detail' : 'details'}
      </summary>
      <dl>
        {entries.map(([key, value]) => (
          <div key={key}>
            <dt>{humanizeKey(key)}</dt>
            <dd>{formatDetailValue(value)}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
};

const COLUMNS: AdminTableColumn<AdminAuditEntry>[] = [
  {
    key: 'time',
    header: 'Time',
    width: '15%',
    render: (entry) => (
      <span className={styles.time}>{formatDateTime(entry.createdAt)}</span>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    width: '19%',
    render: (entry) => {
      const meta = AUDIT_ACTION[entry.action] ?? {
        label: entry.action,
        tone: 'gray' as const,
      };
      return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
    },
  },
  {
    key: 'target',
    header: 'Target',
    width: '24%',
    render: (entry) => <Target entry={entry} />,
  },
  {
    key: 'admin',
    header: 'By',
    width: '18%',
    render: (entry) => <span className={styles.muted}>{entry.adminEmail}</span>,
  },
  {
    key: 'details',
    header: 'Details',
    width: '24%',
    render: (entry) => <Details details={entry.details} />,
  },
];

const AdminAudit = () => {
  const {
    filters,
    page,
    apiPage,
    setFilter,
    setPage,
    clearFilters,
    hasFilters,
  } = useListSearchParams(FILTER_KEYS);

  const auditQuery = useAdminAudit({
    action: (filters.action || undefined) as AdminAuditAction | undefined,
    targetId: filters.targetId || undefined,
    page: apiPage,
    size: ADMIN_PAGE_SIZE,
  });
  const data = auditQuery.data;

  return (
    <>
      <AdminPageHeader
        title='Audit log'
        description='Every admin action, newest first: verifications, bans, payouts, fee payments, product moderation and license views.'
      />

      <FilterBar hasFilters={hasFilters} onClear={clearFilters}>
        <FilterSelect
          label='Action'
          value={filters.action}
          onChange={(value) => setFilter('action', value)}
          options={Object.entries(AUDIT_ACTION).map(([value, meta]) => ({
            value,
            label: meta.label,
          }))}
        />
        {filters.targetId ? (
          <FilterChip
            label='One target'
            onRemove={() => setFilter('targetId', '')}
          />
        ) : null}
      </FilterBar>

      <AdminTable
        columns={COLUMNS}
        rows={data?.content ?? []}
        getRowKey={(entry) => entry.id}
        isLoading={auditQuery.isLoading}
        isFetching={auditQuery.isFetching}
        error={
          auditQuery.isError
            ? extractErrorMessage(
                auditQuery.error,
                'Could not load the audit log.',
              )
            : undefined
        }
        emptyTitle='No actions recorded'
        emptyText={hasFilters ? 'Try other filters or clear them.' : undefined}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
      />
    </>
  );
};

export default AdminAudit;
