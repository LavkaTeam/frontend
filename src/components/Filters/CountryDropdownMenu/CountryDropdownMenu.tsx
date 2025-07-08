import { useEffect, useRef, useState } from 'react';
import { useFilterDropdown } from '@/hooks/useFilterDropdown';
import { SearchIcon } from '@/components/ui/icons/SearchIcon';
import styles from './CountryDropdownMenu.module.css';

interface Country {
  value: string;
  iconId: string;
}

const CountryDropdownMenu: React.FC<{ countries: Country[] }> = ({
  countries,
}) => {
  const { isOpen, toggle, close } = useFilterDropdown();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [search, setSearch] = useState('');

  const handleSelect = (value: string) => {
    setSelectedCountry(value);
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
    country.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.countryDropdown} ref={dropdownRef}>
      <button
        onClick={toggle}
        className={`${styles.button} ${isOpen ? styles.buttonOpen : ''}`}
      >
        {isOpen ? (
          <div className={styles.searchContainer}>
            <SearchIcon />
            <input
              type='text'
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>
        ) : (
          <div className={styles.buttonContent}>
            {selectedCountry && (
              <svg className={styles.flagIcon}>
                <use
                  href={`/icons/flags.svg#${
                    countries.find((c) => c.value === selectedCountry)?.iconId
                  }`}
                />
              </svg>
            )}
            <span>{selectedCountry}</span>
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
      </div>
    </div>
  );
};

export { CountryDropdownMenu };
