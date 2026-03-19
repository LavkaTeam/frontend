import styles from './ActiveFiltersBar.module.css';

interface ActiveFiltersBarProps {
  selectedOptions: string[];
  onRemoveOption: (option: string) => void;
  onClearAll: () => void;
}

export const ActiveFiltersBar = ({
  selectedOptions,
  onRemoveOption,
  onClearAll,
}: ActiveFiltersBarProps) => {
  if (selectedOptions.length === 0) return null;

  return (
    <div className={styles.activeFiltersList}>
      {selectedOptions.map((option) => (
        <span key={option} className={styles.filterTag}>
          {/* Робимо першу букву великою, решту маленькими, якщо це статуси типу NEW */}
          {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
          <button
            className={styles.removeTagBtn}
            onClick={() => onRemoveOption(option)}
            aria-label={`Remove ${option} filter`}
          >
            ✕
          </button>
        </span>
      ))}
      <button className={styles.clearAllBtn} onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
};
