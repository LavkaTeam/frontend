import { useProductFilters } from '@/hooks/useProductFilters';
import { SelectFilter } from '../SelectFilter';
import { PriceRange } from '../PriceRange';
import { CountryDropdownMenu } from '../CountryDropdownMenu';
import { STRENGTH_DICTIONARY } from '@/data/filtersData';
import { useState } from 'react';
import type { SearchFiltersResponse } from '@/types/api';
import styles from './FilterBlock.module.css';

interface FilterBlockProps {
  metaFilters?: SearchFiltersResponse;
  globalFilters?: SearchFiltersResponse;
}

const FilterBlock = ({ metaFilters, globalFilters }: FilterBlockProps) => {
  const {
    filters,
    updateFilter,
    updatePriceRange,
    toggleArrayFilter,
    clearAllFilters,
  } = useProductFilters();

  const [brandsExpanded, setBrandsExpanded] = useState(false);
  const [capacitiesExpanded, setCapacitiesExpanded] = useState(false);

  const showPrice = metaFilters != null || globalFilters != null;
  const showCountries =
    metaFilters?.countries &&
    (metaFilters.countries.length > 0 || !!filters.country);
  const showProducers =
    metaFilters?.producers &&
    (metaFilters.producers.length > 0 || filters.brands.length > 0);
  const showVolume =
    metaFilters?.volumes &&
    (metaFilters.volumes.length > 0 || filters.capacities.length > 0);
  const showStrength =
    metaFilters?.strengths &&
    (metaFilters.strengths.length > 0 || filters.strengths.length > 0);

  if (!metaFilters && !globalFilters) return null;

  return (
    <div className={styles.container}>
      {showPrice && (
        <div className={styles.FilterBox}>
          <div className={styles.PriceBox}>
            <PriceRange
              selectedMin={filters.minPrice}
              selectedMax={filters.maxPrice}
              onChange={(min, max) => updatePriceRange(min, max)}
              minLimit={globalFilters?.minPrice ?? metaFilters?.minPrice ?? 0}
              maxLimit={
                globalFilters?.maxPrice ?? metaFilters?.maxPrice ?? 10000
              }
              disabled={
                (globalFilters?.minPrice ?? metaFilters?.minPrice) ===
                (globalFilters?.maxPrice ?? metaFilters?.maxPrice)
              }
            />
          </div>
        </div>
      )}

      {showPrice && <span className={styles.divider}></span>}

      {showCountries && (
        <div className={styles.FilterBox}>
          <CountryDropdownMenu
            countries={metaFilters.countries}
            selectedCountry={filters.country}
            onSelect={(val) => updateFilter('country', val)}
          />
        </div>
      )}

      {showStrength && (
        <div className={styles.FilterBox}>
          <span className={styles.label}>Strength:</span>
          <div className={styles.SelectFilterBox}>
            {metaFilters.strengths.map((str) => {
              const labelData = STRENGTH_DICTIONARY[str.name] || {
                label: `${str.name}%`,
                subTitle: '',
              };
              return (
                <SelectFilter
                  key={str.name}
                  title={labelData.label}
                  subtitle={labelData.subTitle}
                  checked={filters.strengths.includes(str.name)}
                  onChange={() => toggleArrayFilter('strength', str.name)}
                />
              );
            })}
          </div>
        </div>
      )}

      {showVolume && (
        <div className={styles.FilterBox}>
          <span className={styles.label}>Capacity:</span>
          <div className={styles.SelectFilterBox}>
            {metaFilters.volumes.slice(0, 8).map((vol) => (
              <SelectFilter
                key={vol.name}
                title={`${vol.name} l`}
                checked={filters.capacities.includes(vol.name)}
                onChange={() => toggleArrayFilter('capacity', vol.name)}
              />
            ))}
            {metaFilters.volumes.length > 8 && (
              <div
                className={`${styles.expandableList} ${capacitiesExpanded ? styles.expanded : ''}`}
              >
                <div className={styles.expandableInner}>
                  {metaFilters.volumes.slice(8).map((vol) => (
                    <SelectFilter
                      key={vol.name}
                      title={`${vol.name} l`}
                      checked={filters.capacities.includes(vol.name)}
                      onChange={() => toggleArrayFilter('capacity', vol.name)}
                    />
                  ))}
                </div>
              </div>
            )}
            {metaFilters.volumes.length > 8 && (
              <button
                className={styles.showMoreBtn}
                onClick={() => setCapacitiesExpanded((prev) => !prev)}
              >
                {capacitiesExpanded ? 'Show less' : '+ Show more'}
              </button>
            )}
          </div>
          {metaFilters.volumes.length > 8 && (
            <span className={styles.divider}></span>
          )}
        </div>
      )}

      {showProducers && (
        <div className={styles.FilterBox}>
          <span className={styles.label}>Brands:</span>
          <div className={styles.SelectFilterBox}>
            {metaFilters.producers.slice(0, 8).map((producer) => (
              <SelectFilter
                key={producer.name}
                title={producer.name}
                checked={filters.brands.includes(producer.name)}
                onChange={() => toggleArrayFilter('brand', producer.name)}
              />
            ))}
            {metaFilters.producers.length > 8 && (
              <div
                className={`${styles.expandableList} ${brandsExpanded ? styles.expanded : ''}`}
              >
                <div className={styles.expandableInner}>
                  {metaFilters.producers.slice(8).map((producer) => (
                    <SelectFilter
                      key={producer.name}
                      title={producer.name}
                      checked={filters.brands.includes(producer.name)}
                      onChange={() => toggleArrayFilter('brand', producer.name)}
                    />
                  ))}
                </div>
              </div>
            )}
            {metaFilters.producers.length > 8 && (
              <button
                className={styles.showMoreBtn}
                onClick={() => setBrandsExpanded((prev) => !prev)}
              >
                {brandsExpanded ? 'Show less' : '+ Show more'}
              </button>
            )}
          </div>
          {metaFilters.producers.length > 8 && (
            <span className={styles.divider}></span>
          )}
        </div>
      )}

      {metaFilters?.hasPromotionsAvailable && (
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
      )}

      <button className={styles.ClearButton} onClick={clearAllFilters}>
        Clear filters
      </button>
    </div>
  );
};

export { FilterBlock };
