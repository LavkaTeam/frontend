import { useState, useRef, useEffect } from 'react';
import styles from './ProductSort.module.css';

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest arrivals' },
  { value: 'price,asc', label: 'Price: Low to High' },
  { value: 'price,desc', label: 'Price: High to Low' },
  { value: 'salesCount,desc', label: 'Most popular' },
  { value: 'averageRating,desc', label: 'Highest rated' },
];

export const ProductSort = ({ value, onChange }: ProductSortProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <span className={styles.label}>Sort by:</span>
      <div className={styles.dropdownWrapper}>
        <button 
          className={`${styles.dropdownButton} ${isOpen ? styles.isOpen : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span className={styles.selectedValue}>{selectedOption.label}</span>
          <svg
            className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="#667085"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.optionsList}>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`${styles.optionItem} ${option.value === value ? styles.active : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
