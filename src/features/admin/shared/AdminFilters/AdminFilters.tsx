import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import { DateInput } from '@/components/ui/DateInput';
import { DropdownField } from '@/components/ui/DropdownField';
import { Input } from '@/components/ui/Input';

import styles from './AdminFilters.module.css';

interface FilterOption {
  value: string;
  label: string;
}

const FilterBar = ({
  children,
  hasFilters,
  onClear,
}: {
  children: ReactNode;
  hasFilters: boolean;
  onClear: () => void;
}) => (
  <div className={styles.bar}>
    {children}
    {hasFilters ? (
      <button type='button' className={styles.clear} onClick={onClear}>
        Clear filters
      </button>
    ) : null}
  </div>
);

interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  // Label of the empty value, i.e. "no filter".
  allLabel?: string;
}

// The app dropdown (same as in seller finances and product forms). The empty
// value stands for "no filter".
const FilterSelect = ({
  label,
  value,
  options,
  onChange,
  allLabel = 'All',
}: FilterSelectProps) => (
  <DropdownField
    className={styles.field}
    label={label}
    value={value}
    placeholder={allLabel}
    options={[{ value: '', label: allLabel }, ...options]}
    onSelect={onChange}
  />
);

const SEARCH_DELAY_MS = 350;

interface FilterSearchProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

// Applies the search after the user stops typing, not on every key.
const FilterSearch = ({
  label,
  value,
  placeholder,
  onChange,
}: FilterSearchProps) => {
  const id = useId();
  const [draft, setDraft] = useState(value);
  // Callers pass inline callbacks; a ref keeps the timer from restarting on
  // every parent render.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Follows outside changes, e.g. "Clear filters".
  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (draft.trim() === value) return undefined;

    const timerId = window.setTimeout(
      () => onChangeRef.current(draft.trim()),
      SEARCH_DELAY_MS,
    );
    return () => window.clearTimeout(timerId);
  }, [draft, value]);

  return (
    <div className={`${styles.field} ${styles.searchField}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <Input
        id={id}
        type='search'
        value={draft}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
      />
    </div>
  );
};

interface FilterDateProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

const FilterDate = ({ label, value, onChange, min, max }: FilterDateProps) => (
  <div className={styles.field}>
    <DateInput
      label={label}
      value={value}
      min={min}
      max={max}
      onChange={onChange}
    />
  </div>
);

// Shows a filter that is set by a link (e.g. "orders of this seller") and
// has no control of its own.
const FilterChip = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <span className={styles.chip}>
    {label}
    <button
      type='button'
      className={styles.chipRemove}
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
    >
      ✕
    </button>
  </span>
);

export { FilterBar, FilterChip, FilterDate, FilterSearch, FilterSelect };
export type { FilterOption };
