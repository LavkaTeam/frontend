import { useRef, useState } from 'react';

import { useOnClickOutside } from '@/hooks/useOnClickOutside';

import styles from './DropdownField.module.css';

export type DropdownOption = {
  value: string;
  label: string;
};

interface DropdownFieldProps {
  label?: string;
  value: string;
  placeholder: string;
  options: DropdownOption[];
  error?: string;
  disabled?: boolean;
  className?: string;
  onSelect: (value: string) => void;
}

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`${styles.dropdownArrow} ${isOpen ? styles.dropdownArrowOpen : ''}`}
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <polyline points='6 9 12 15 18 9' />
  </svg>
);

const DropdownField = ({
  label,
  value,
  placeholder,
  options,
  error,
  disabled,
  className = '',
  onSelect,
}: DropdownFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`${styles.field} ${className}`.trim()}>
      {label ? <label className={styles.label}>{label}</label> : null}
      <div
        className={`${styles.dropdownField} ${isOpen ? styles.dropdownFieldOpen : ''}`}
        ref={containerRef}
      >
        <button
          type='button'
          className={`${styles.dropdownButton} ${error ? styles.dropdownButtonError : ''} ${
            isOpen ? styles.dropdownButtonOpen : ''
          }`}
          onClick={() => !disabled && setIsOpen((previous) => !previous)}
          disabled={disabled}
        >
          <span
            className={`${styles.dropdownValue} ${selectedOption ? '' : styles.dropdownPlaceholder}`}
          >
            {selectedOption?.label || placeholder}
          </span>
          <ChevronIcon isOpen={isOpen} />
        </button>

        {isOpen ? (
          <div className={styles.dropdownMenu}>
            {options.map((option) => (
              <button
                key={option.value}
                type='button'
                className={`${styles.dropdownOption} ${
                  option.value === value ? styles.dropdownOptionActive : ''
                }`}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </div>
  );
};

export { DropdownField };
