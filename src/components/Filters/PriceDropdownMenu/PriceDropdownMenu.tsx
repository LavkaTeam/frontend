import { useEffect, useRef } from 'react';
import { useFilterDropdown } from '@/hooks/useFilterDropdown';
import styles from './PriceDropdownMenu.module.css';

interface PriceDropdownMenuProps {
  label: string;
  options: number[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const PriceDropdownMenu: React.FC<PriceDropdownMenuProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
}) => {
  const { isOpen, toggle, close } = useFilterDropdown();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: number | string) => {
    const newVal = String(option);

    const finalValue = newVal === selectedValue ? '' : newVal;

    onSelect(finalValue);
    close();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
        {/* Якщо вибрано - показуємо з $, інакше Label (From/To) */}
        {selectedValue ? `$${selectedValue}` : label}
        <img
          src='/icons/dropdown-arrow.svg'
          alt='Dropdown arrow'
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
        />
      </button>

      <div
        className={`${styles.dropdownMenu} ${isOpen ? styles.open : styles.closed}`}
      >
        <div
          className={`${styles.option} ${!selectedValue ? styles.selected : ''}`}
          onClick={() => handleSelect('')}
        >
          {label}
          {!selectedValue && (
            <img
              src='/icons/checkTick.svg'
              alt='Checkmark'
              className={styles.checkmark}
            />
          )}
        </div>

        {options.map((option) => (
          <div
            key={option}
            className={`${styles.option} ${selectedValue === String(option) ? styles.selected : ''}`}
            onClick={() => handleSelect(option)}
          >
            ${option}
            {selectedValue === String(option) && (
              <img
                src='/icons/checkTick.svg'
                alt='Checkmark'
                className={styles.checkmark}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { PriceDropdownMenu };
