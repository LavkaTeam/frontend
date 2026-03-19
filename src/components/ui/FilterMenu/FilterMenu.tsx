import { Checkbox } from '@/components/ui/Checkbox';
import styles from './FilterMenu.module.css';

interface FilterMenuProps {
  title?: string;
  isOpen: boolean;
  options: string[];
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
  onClearFilters: () => void;
}

export const FilterMenu = ({
  title = 'Filter:',
  isOpen,
  options,
  selectedOptions,
  onToggleOption,
  onClearFilters,
}: FilterMenuProps) => {
  return (
    <div className={`${styles.filterMenu} ${isOpen ? styles.open : ''}`}>
      <span className={styles.filterTitle}>{title}</span>

      <div className={styles.optionsList}>
        {options.map((option) => (
          <div
            key={option}
            className={styles.optionItem}
            onClick={() => onToggleOption(option)}
          >
            <div className={styles.checkboxWrapper}>
              <Checkbox
                label={option}
                checked={selectedOptions.includes(option)}
                onChange={() => {}}
                tabIndex={-1}
              />
            </div>
          </div>
        ))}
      </div>

      <button className={styles.clearBtn} onClick={onClearFilters}>
        Clear filters
      </button>
    </div>
  );
};
