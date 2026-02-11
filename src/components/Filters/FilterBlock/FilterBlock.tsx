import { useProductFilters } from '@/hooks/useProductFilters';
import { SelectFilter } from '../SelectFilter';
import { PriceDropdownMenu } from '../PriceDropdownMenu';
import { CountryDropdownMenu } from '../CountryDropdownMenu';
import {
  priceFromOptions,
  priceToOptions,
  countries,
  capacityOptions,
  strengthOptions,
} from '@/data/filtersData';
import styles from './FilterBlock.module.css';

const FilterBlock = () => {
  const { filters, updateFilter, toggleArrayFilter, clearAllFilters } =
    useProductFilters();

  return (
    <div className={styles.container}>
      {/* --- ЗАГЛУШКА (OVERLAY) --- */}
      <div className={styles.overlay}>
        <div className={styles.messageBox}>
          <span className={styles.messageTitle}>Filters unavailable</span>
          <span className={styles.messageSubtitle}>
            We are currently updating our catalog system.
          </span>
        </div>
      </div>
      {/* -------------------------- */}

      <div className={styles.FilterBox}>
        <span className={styles.label}>Price Range</span>
        <div className={styles.PriceBox}>
          <PriceDropdownMenu
            label='From'
            options={priceFromOptions}
            selectedValue={filters.priceFrom}
            onSelect={(val) => updateFilter('priceFrom', val)}
          />
          <PriceDropdownMenu
            label='To'
            options={priceToOptions}
            selectedValue={filters.priceTo}
            onSelect={(val) => updateFilter('priceTo', val)}
          />
        </div>
      </div>

      <span className={styles.divider}></span>

      <div className={styles.FilterBox}>
        <CountryDropdownMenu
          countries={countries}
          selectedCountry={filters.country}
          onSelect={(val) => updateFilter('country', val)}
        />
      </div>

      <div className={styles.FilterBox}>
        <span className={styles.label}>Capacity:</span>
        <div className={styles.SelectFilterBox}>
          {capacityOptions.map((option) => (
            <SelectFilter
              key={option}
              title={`${option} l`}
              checked={filters.capacities.includes(option)}
              onChange={() => toggleArrayFilter('capacity', option)}
            />
          ))}
        </div>
      </div>

      <div className={styles.FilterBox}>
        <span className={styles.label}>Strength:</span>
        <div className={styles.SelectFilterBox}>
          {strengthOptions.map((option) => (
            <SelectFilter
              key={option.value}
              title={option.label}
              subtitle={option.subTitle}
              checked={filters.strengths.includes(option.value)}
              onChange={() => toggleArrayFilter('strength', option.value)}
            />
          ))}
        </div>
      </div>

      <div className={styles.FilterBox}>
        <div className={styles.ToggleBox}>
          <input
            type='checkbox'
            id='check'
            className={styles.ToggleButtonInput}
            checked={filters.promotions}
            onChange={(e) =>
              updateFilter('promotions', e.target.checked ? 'true' : null)
            }
          />
          <label htmlFor='check' className={styles.ToggleButton}></label>
          <span className={styles.ToggleLabel}>Show promotions</span>
        </div>
      </div>

      <span className={styles.divider}></span>

      <button className={styles.ClearButton} onClick={clearAllFilters}>
        Clear filters
      </button>
    </div>
  );
};

export { FilterBlock };
