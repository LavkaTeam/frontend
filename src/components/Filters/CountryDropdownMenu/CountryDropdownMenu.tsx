import { useEffect, useRef, useState } from 'react';
import { useFilterDropdown } from '@/hooks/useFilterDropdown';
import { SearchIcon } from '@/components/ui/icons/SearchIcon';
import styles from './CountryDropdownMenu.module.css';

interface Country {
  value: string;
  iconId: string;
}

interface CountryDropdownProps {
  countries: Country[];
  selectedCountry: string;
  onSelect: (value: string) => void;
}

const CountryDropdownMenu: React.FC<CountryDropdownProps> = ({
  countries,
  selectedCountry,
  onSelect,
}) => {
  const { isOpen, toggle, close } = useFilterDropdown();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');

  const handleSelect = (value: string) => {
    onSelect(value);
    close();
    setSearch('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  const filteredCountries = countries.filter((country) =>
    country.value.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.countryDropdown} ref={dropdownRef}>
      <button
        onClick={toggle}
        className={`${styles.button} ${isOpen ? styles.buttonOpen : ''}`}
      >
        {isOpen ? (
          <div className={styles.searchContainer}>
            <div className={styles.searchIconWrapper}>
              <SearchIcon />
            </div>
            <input
              type='text'
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <div className={styles.buttonContent}>
            {!selectedCountry && (
              <div className={styles.inactiveSearchIcon}>
                <SearchIcon />
              </div>
            )}

            <div className={styles.valueWrapper}>
              {selectedCountry ? (
                <>
                  <svg className={styles.flagIcon}>
                    <use
                      href={`/icons/flags.svg#${
                        countries.find((c) => c.value === selectedCountry)
                          ?.iconId
                      }`}
                    />
                  </svg>
                  <span className={styles.selectedText}>{selectedCountry}</span>
                </>
              ) : (
                <span className={styles.placeholder}>Select country</span>
              )}
            </div>
          </div>
        )}
        <img
          src='/icons/dropdown-arrow.svg'
          alt='Dropdown arrow'
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
        />
      </button>

      <div
        className={`${styles.dropdownMenu} ${
          isOpen ? styles.open : styles.closed
        }`}
      >
        {!search && (
          <div
            className={`${styles.option} ${!selectedCountry ? styles.selected : ''}`}
            onClick={() => handleSelect('')}
          >
            <SearchIcon />
            <span>All Countries</span>
            {!selectedCountry && (
              <img
                src='/icons/checkTick.svg'
                alt='Checkmark'
                className={styles.checkmark}
              />
            )}
          </div>
        )}

        {filteredCountries.map((country) => (
          <div
            key={country.value}
            className={`${styles.option} ${
              selectedCountry === country.value ? styles.selected : ''
            }`}
            onClick={() => handleSelect(country.value)}
          >
            <svg className={styles.flagIcon}>
              <use href={`/icons/flags.svg#${country.iconId}`} />
            </svg>
            <span>{country.value}</span>
            {selectedCountry === country.value && (
              <img
                src='/icons/checkTick.svg'
                alt='Checkmark'
                className={styles.checkmark}
              />
            )}
          </div>
        ))}

        {filteredCountries.length === 0 && search && (
          <div
            className={styles.option}
            style={{ cursor: 'default', color: '#9CA3AF' }}
          >
            No countries found
          </div>
        )}
      </div>
    </div>
  );
};

export { CountryDropdownMenu };
