import styles from './SelectFilter.module.css';
import { Checkbox } from '@/components/ui/Checkbox';

interface SelectFilterProps {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: () => void;
}

const SelectFilter = ({
  title,
  subtitle,
  checked,
  onChange,
}: SelectFilterProps) => {
  return (
    <label
      className={`${styles.box} ${subtitle ? styles['has-subtitle'] : ''}`}
    >
      <Checkbox label='' checked={checked} onChange={onChange} />
      <div
        className={`${styles.textContainer} ${
          subtitle ? styles['has-subtitle'] : ''
        }`}
      >
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </label>
  );
};

export { SelectFilter };
