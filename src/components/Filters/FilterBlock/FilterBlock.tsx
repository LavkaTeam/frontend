import styles from './FilterBlock.module.css';
import { SelectFilter } from '../SelectFilter';
import { PriceDropdownMenu } from '../PriceDropdownMenu';
import { priceFromOptions, priceToOptions, capacityOptions, strengthOptions } from '@/data/filtersData';
import { useState } from 'react';

const FilterBlock = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.FilterBox}>
        <span className={styles.label}>$0-100</span>
        <div className={styles.PriceBox}>
          <PriceDropdownMenu
            label="From"
            options={priceFromOptions}
            selectedValue={fromValue}
            onSelect={setFromValue}
          />
          <PriceDropdownMenu
            label="To"
            options={priceToOptions}
            selectedValue={toValue}
            onSelect={setToValue}
            />
        </div>
      </div>
      <span className={styles.divider}></span>
      <div className={styles.FilterBox}>
        <span className={styles.label}>Capacity:</span>
        <div className={styles.SelectFilterBox}>
          {capacityOptions.map((option) => (
            <SelectFilter
              key={option}
              title={option}
            />
          ))}
        </div>
      </div>
      <div className={styles.FilterBox}>
        <span className={styles.label}>Strength:</span>
        <div className={styles.SelectFilterBox}>
          {strengthOptions.map((option) => (
            <SelectFilter
              title={option.Title}
              subtitle={option.subTitle}
            />
          ))}
        </div>
      </div>
      <div className={styles.FilterBox}>
          <div className={styles.ToggleBox}>
              <input
                type='checkbox' id='check'
                className={styles.ToggleButtonInput}
                defaultChecked
              />
              <label htmlFor='check' className={styles.ToggleButton}></label>   
              <span className={styles.ToggleLabel}>Show promotions</span>
          </div>
      </div>
      <span className={styles.divider}></span>
      <button className={styles.ClearButton}>Clear filters</button>
    </div>
  );
};

export { FilterBlock };