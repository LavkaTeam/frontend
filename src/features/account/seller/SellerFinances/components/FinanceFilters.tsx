import { DropdownField } from '@/components/ui/DropdownField';
import type { TransactionStatus, TransactionType } from '../model/finance.types';

import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_OPTIONS,
  TRANSACTION_TYPE_FILTER_OPTIONS,
} from '../config/financeDisplay';
import { DateRangeInput } from './DateRangeInput';
import styles from './FinanceFilters.module.css';

type TypeFilterValue = 'ALL' | TransactionType;

interface FinanceFiltersProps {
  type: TypeFilterValue;
  status?: TransactionStatus;
  startDate: string;
  endDate: string;
  hasInvalidDateRange: boolean;
  onTypeChange: (type: TypeFilterValue) => void;
  onStatusChange: (status?: TransactionStatus) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const FinanceFilters = ({
  type,
  status,
  startDate,
  endDate,
  hasInvalidDateRange,
  onTypeChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
}: FinanceFiltersProps) => {
  const statusOptions = [
    { value: 'ALL', label: 'All statuses' },
    ...TRANSACTION_STATUS_OPTIONS.map((option) => ({
      value: option,
      label: TRANSACTION_STATUS_LABELS[option],
    })),
  ];

  return (
    <>
      <div className={styles.filters}>
        <DropdownField
          className={styles.filterField}
          label='By type'
          value={type}
          placeholder='All types'
          options={TRANSACTION_TYPE_FILTER_OPTIONS}
          onSelect={(value) => onTypeChange(value as TypeFilterValue)}
        />

        <DropdownField
          className={styles.filterField}
          label='By status'
          value={status || 'ALL'}
          placeholder='All statuses'
          options={statusOptions}
          onSelect={(value) =>
            onStatusChange(value === 'ALL' ? undefined : (value as TransactionStatus))
          }
        />

        <div className={`${styles.filterField} ${styles.dateRangeField}`}>
          <DateRangeInput
            label='Date range'
            value={startDate}
            max={endDate || undefined}
            onChange={onStartDateChange}
          />
          <span className={styles.dateDivider}>to</span>
          <DateRangeInput
            label=' '
            value={endDate}
            min={startDate || undefined}
            onChange={onEndDateChange}
          />
        </div>
      </div>

      {hasInvalidDateRange ? (
        <p className={styles.filtersError}>
          The start date cannot be later than the end date.
        </p>
      ) : null}
    </>
  );
};

export { FinanceFilters };
