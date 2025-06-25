import { useEffect, useRef } from 'react';
import { useFilterPriceDropdown } from '@/hooks/useFilterPriceDropdown';
import styles from './PriceDropdownMenu.module.css';

interface PriceDropdownMenuProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const PriceDropdownMenu: React.FC<PriceDropdownMenuProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
}) => {
  const { isOpen, toggle, close } = useFilterPriceDropdown();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onSelect(option);
    close();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [close]);

  return (
    <div className={styles.priceDropdown} ref={dropdownRef}>
      <button
        onClick={toggle}
        className={`${styles.button} ${isOpen ? styles.buttonOpen : ''}`}
      >
        {selectedValue || label}
        <img
          src="/icons/dropdown-arrow.svg"
          alt="Dropdown arrow"
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
        />
      </button>
      <div className={`${styles.dropdownMenu} ${isOpen ? styles.open : styles.closed}`}>
        {options.map((option) => (
          <div
            key={option}
            className={styles.option}
            onClick={() => handleSelect(option)}
          >
            {option}
            {selectedValue === option && (
              <img src="/icons/checkTick.svg" alt="Checkmark" className={styles.checkmark} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { PriceDropdownMenu };