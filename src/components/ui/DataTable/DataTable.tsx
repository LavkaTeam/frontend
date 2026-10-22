import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/Skeleton';

import styles from './DataTable.module.css';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  // Share of the table width, e.g. '20%'. Columns without it split the rest.
  width?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  // Makes the whole row clickable (mouse and keyboard).
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  // Replaces the rows, e.g. when the request failed.
  error?: ReactNode;
  emptyTitle: string;
  emptyText?: string;
  // Below this width the table scrolls horizontally.
  minWidth?: number;
  // 'comfortable' gives rows with several lines (e.g. two badges) more air.
  density?: 'default' | 'comfortable';
}

const SKELETON_ROWS = 6;

/**
 * List table in the style of the seller orders and products tables: rows are
 * separate bordered cards, the header is grey, a row lifts on hover.
 */
const DataTable = <T,>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  isLoading = false,
  error,
  emptyTitle,
  emptyText,
  minWidth = 920,
  density = 'default',
}: DataTableProps<T>) => {
  if (!isLoading && error) {
    return (
      <div className={styles.emptyState}>
        <h4>Something went wrong</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (!isLoading && rows.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h4>{emptyTitle}</h4>
        {emptyText ? <p>{emptyText}</p> : null}
      </div>
    );
  }

  const rowDensity = density === 'comfortable' ? styles.rowComfortable : '';

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table} style={{ minWidth }}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                <tr key={index} className={`${styles.row} ${rowDensity}`}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      <Skeleton
                        className={styles.cellSkeleton}
                        width='70%'
                        height={18}
                        radius={6}
                      />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className={`${styles.row} ${rowDensity} ${onRowClick ? styles.rowClickable : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.target !== event.currentTarget) return;
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  {columns.map((column) => (
                    <td key={column.key}>{column.render(row)}</td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export { DataTable };
