import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pagination } from '@/components/Pagination';
import { BlockingOverlay } from '@/components/ui/BlockingOverlay';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';

import styles from './AdminTable.module.css';

export type AdminTableColumn<T> = DataTableColumn<T>;

interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  // Route to open when a row is clicked.
  getRowHref?: (row: T) => string;
  // Alternative to getRowHref: run an action, e.g. open a details dialog.
  onRowClick?: (row: T) => void;
  isLoading: boolean;
  isFetching?: boolean;
  error?: ReactNode;
  emptyTitle: string;
  emptyText?: string;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  minWidth?: number;
  density?: 'default' | 'comfortable';
}

// One admin list: result count, the shared table, and pagination. Fetching a
// new page or filter dims the list instead of replacing it with a loader.
const AdminTable = <T,>({
  columns,
  rows,
  getRowKey,
  getRowHref,
  onRowClick,
  isLoading,
  isFetching = false,
  error,
  emptyTitle,
  emptyText,
  page,
  totalPages,
  totalElements,
  onPageChange,
  minWidth,
  density,
}: AdminTableProps<T>) => {
  const navigate = useNavigate();

  return (
    <BlockingOverlay active={isFetching && !isLoading} className={styles.list}>
      {!isLoading && !error && totalElements > 0 ? (
        <p className={styles.count}>
          {totalElements} {totalElements === 1 ? 'result' : 'results'}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        onRowClick={
          getRowHref ? (row) => navigate(getRowHref(row)) : onRowClick
        }
        isLoading={isLoading}
        error={error}
        emptyTitle={emptyTitle}
        emptyText={emptyText}
        minWidth={minWidth}
        density={density}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        noPaddings
        disabled={isFetching && !isLoading}
      />
    </BlockingOverlay>
  );
};

export { AdminTable };
