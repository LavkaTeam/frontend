import { useEffect, useMemo, useRef, useState } from 'react';

import styles from './DateRangeInput.module.css';

interface DateRangeInputProps {
  label: string;
  value: string;
  min?: string;
  max?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const formatIsoToDisplay = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';

  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
};

const normalizeDisplayInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return [day, month, year].filter(Boolean).join('.');
};

const parseDisplayToIso = (value: string) => {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

  if (!match) return '';

  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  const date = new Date(`${iso}T00:00:00`);

  if (Number.isNaN(date.getTime())) return '';

  const isSameDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() + 1 === Number(month) &&
    date.getDate() === Number(day);

  return isSameDate ? iso : '';
};

const CalendarIcon = () => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
    <line x1='16' y1='2' x2='16' y2='6' />
    <line x1='8' y1='2' x2='8' y2='6' />
    <line x1='3' y1='10' x2='21' y2='10' />
  </svg>
);

const DateRangeInput = ({
  label,
  value,
  min,
  max,
  placeholder = 'dd.mm.yyyy',
  onChange,
}: DateRangeInputProps) => {
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(formatIsoToDisplay(value));
  const normalizedValue = useMemo(() => formatIsoToDisplay(value), [value]);

  useEffect(() => {
    setDisplayValue(normalizedValue);
  }, [normalizedValue]);

  const openNativePicker = () => {
    const nativeInput = nativeInputRef.current as
      | (HTMLInputElement & { showPicker?: () => void })
      | null;

    if (!nativeInput) return;

    if (typeof nativeInput.showPicker === 'function') {
      nativeInput.showPicker();
      return;
    }

    nativeInput.focus();
    nativeInput.click();
  };

  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>

      <div className={styles.inputWrapper}>
        <input
          type='text'
          inputMode='numeric'
          className={styles.input}
          value={displayValue}
          placeholder={placeholder}
          onChange={(event) => {
            const nextDisplayValue = normalizeDisplayInput(event.target.value);
            setDisplayValue(nextDisplayValue);

            if (!nextDisplayValue) {
              onChange('');
              return;
            }

            const isoValue = parseDisplayToIso(nextDisplayValue);

            if (isoValue) {
              onChange(isoValue);
            }
          }}
          onBlur={() => {
            const isoValue = parseDisplayToIso(displayValue);

            if (!displayValue) {
              onChange('');
              return;
            }

            if (!isoValue) {
              setDisplayValue(normalizedValue);
            }
          }}
        />

        <button
          type='button'
          className={styles.calendarButton}
          onClick={openNativePicker}
          aria-label={`Open ${label.toLowerCase()} calendar`}
        >
          <CalendarIcon />
        </button>

        <input
          ref={nativeInputRef}
          type='date'
          lang='en'
          className={styles.nativeDateInput}
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          tabIndex={-1}
          aria-hidden='true'
        />
      </div>
    </label>
  );
};

export { DateRangeInput };
