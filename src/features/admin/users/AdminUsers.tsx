import { useAdminUsers } from '@/hooks/useAdmin';
import type {
  AdminUserListItem,
  AdminUserRole,
  AdminUserSort,
} from '@/types/admin';
import type { VerificationStatus } from '@/types/user';
import { extractErrorMessage } from '@/utils/error';

import {
  formatDate,
  formatPersonName,
  ROLE_LABELS,
  VERIFICATION_STATUS,
} from '../model/adminDisplay';
import {
  ADMIN_PAGE_SIZE,
  useListSearchParams,
} from '../model/useListSearchParams';
import {
  FilterBar,
  FilterSearch,
  FilterSelect,
} from '../shared/AdminFilters/AdminFilters';
import { AdminPageHeader } from '../shared/AdminPageHeader/AdminPageHeader';
import {
  AdminTable,
  type AdminTableColumn,
} from '../shared/AdminTable/AdminTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

import styles from './AdminUsers.module.css';

const FILTER_KEYS = ['role', 'status', 'banned', 'q', 'sort'] as const;

const COLUMNS: AdminTableColumn<AdminUserListItem>[] = [
  {
    key: 'company',
    header: 'Company',
    width: '30%',
    render: (user) => (
      <div className={styles.identity}>
        <span className={styles.company}>
          {user.companyName || formatPersonName(user.firstName, user.lastName)}
        </span>
        <span className={styles.email}>{user.email}</span>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    width: '10%',
    render: (user) => ROLE_LABELS[user.role] || user.role,
  },
  {
    key: 'verification',
    header: 'Verification',
    width: '22%',
    render: (user) => {
      const meta = VERIFICATION_STATUS[user.verificationStatus];

      return (
        <div className={styles.status}>
          <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
          {!user.profileComplete ? (
            <span className={styles.note}>Profile incomplete</span>
          ) : null}
        </div>
      );
    },
  },
  {
    key: 'account',
    header: 'Account',
    width: '20%',
    render: (user) => (
      <div className={styles.status}>
        {user.banned ? (
          <StatusBadge tone='burgundy'>Banned</StatusBadge>
        ) : (
          <StatusBadge tone='green'>Active</StatusBadge>
        )}
        {!user.emailVerified ? (
          <span className={styles.note}>Email not confirmed</span>
        ) : null}
      </div>
    ),
  },
  {
    key: 'registered',
    header: 'Registered',
    width: '18%',
    render: (user) => formatDate(user.registeredAt),
  },
];

const AdminUsers = () => {
  const {
    filters,
    page,
    apiPage,
    setFilter,
    setPage,
    clearFilters,
    hasFilters,
  } = useListSearchParams(FILTER_KEYS);
  const isReviewQueue = filters.status === 'PENDING';

  const usersQuery = useAdminUsers({
    role: (filters.role || undefined) as AdminUserRole | undefined,
    status: (filters.status || undefined) as VerificationStatus | undefined,
    banned: filters.banned ? filters.banned === 'true' : undefined,
    q: filters.q || undefined,
    sort: (filters.sort || undefined) as AdminUserSort | undefined,
    page: apiPage,
    size: ADMIN_PAGE_SIZE,
  });
  const data = usersQuery.data;

  return (
    <>
      <AdminPageHeader
        title={isReviewQueue ? 'Company review' : 'Users'}
        description={
          isReviewQueue
            ? 'Companies that submitted their profile and wait for verification. Sort by oldest to review them in order.'
            : 'Buyers and sellers of the marketplace. Open a user to review the company or ban the account.'
        }
      />

      <FilterBar hasFilters={hasFilters} onClear={clearFilters}>
        <FilterSearch
          label='Search'
          value={filters.q}
          placeholder='Email, name or company'
          onChange={(value) => setFilter('q', value)}
        />
        <FilterSelect
          label='Role'
          value={filters.role}
          onChange={(value) => setFilter('role', value)}
          options={[
            { value: 'BUYER', label: 'Buyers' },
            { value: 'SELLER', label: 'Sellers' },
          ]}
        />
        <FilterSelect
          label='Verification'
          value={filters.status}
          onChange={(value) => setFilter('status', value)}
          options={Object.entries(VERIFICATION_STATUS).map(([value, meta]) => ({
            value,
            label: meta.label,
          }))}
        />
        <FilterSelect
          label='Account'
          value={filters.banned}
          onChange={(value) => setFilter('banned', value)}
          options={[
            { value: 'false', label: 'Active' },
            { value: 'true', label: 'Banned' },
          ]}
        />
        <FilterSelect
          label='Sort'
          value={filters.sort}
          allLabel='Newest first'
          onChange={(value) => setFilter('sort', value)}
          options={[{ value: 'oldest', label: 'Oldest first' }]}
        />
      </FilterBar>

      <AdminTable
        columns={COLUMNS}
        rows={data?.content ?? []}
        getRowKey={(user) => user.id}
        getRowHref={(user) => `/admin/users/${user.id}`}
        isLoading={usersQuery.isLoading}
        isFetching={usersQuery.isFetching}
        error={
          usersQuery.isError
            ? extractErrorMessage(usersQuery.error, 'Could not load users.')
            : undefined
        }
        emptyTitle={
          isReviewQueue ? 'No companies waiting for review' : 'No users found'
        }
        emptyText={hasFilters ? 'Try other filters or clear them.' : undefined}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
      />
    </>
  );
};

export default AdminUsers;
