import styles from './SelectFilter.module.css';
import { Checkbox } from '@/components/ui/Checkbox';

interface SelectFilterProps {
  title: string;
  subtitle?: string;
}

const SelectFilter = ({ title, subtitle }: SelectFilterProps) => {
  return (
    <label className={`${styles.box} ${subtitle ? styles['has-subtitle'] : ''}`}>
      <Checkbox label=''/>
      <div className={`${styles.textContainer} ${subtitle ? styles['has-subtitle'] : ''}`}>        <span className={styles.title}>{title}</span>
        {subtitle && 
          <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </label>
  );
};

export { SelectFilter };