import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state to keep UI responsive while debouncing URL updates
  const [localParams, setLocalParams] = useState<URLSearchParams>(new URLSearchParams(searchParams));
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when URL changes externally (e.g. back button, manual URL edit)
  useEffect(() => {
    setLocalParams(new URLSearchParams(searchParams));
  }, [searchParams]);

  const pushParams = useCallback((newParams: URLSearchParams, debounce = false) => {
    setLocalParams(new URLSearchParams(newParams));

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (debounce) {
      debounceTimer.current = setTimeout(() => {
        setSearchParams(newParams);
      }, 600);
    } else {
      setSearchParams(newParams);
    }
  }, [setSearchParams]);

  // Отримуємо значення з локального стейту (для миттєвої реакції UI)
  const minPrice = localParams.get('minPrice') || '';
  const maxPrice = localParams.get('maxPrice') || '';
  const country = localParams.get('country') || '';
  const promotions = localParams.get('promotions') === 'true';
  const sort = localParams.get('sort') || 'createdAt,desc';

  const capacities = localParams.getAll('capacity');
  const strengths = localParams.getAll('strength');
  const brands = localParams.getAll('brand');
  const styles = localParams.getAll('style');

  const updateFilter = (key: string, value: string | null | undefined) => {
    const newParams = new URLSearchParams(localParams);
    if (value === null || value === undefined || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.delete('page');
    pushParams(newParams, false); // Instant for single dropdowns/toggles
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(localParams);
    const values = newParams.getAll(key);

    if (values.includes(value)) {
      newParams.delete(key);
      values
        .filter((v) => v !== value)
        .forEach((v) => newParams.append(key, v));
    } else {
      newParams.append(key, value);
    }
    newParams.delete('page');
    pushParams(newParams, true); // Debounced for checkboxes
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    // Keep category/subcategory/name if they are in URL
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const name = searchParams.get('name');
    
    if (category) newParams.set('category', category);
    if (subcategory) newParams.set('subcategory', subcategory);
    if (name) newParams.set('name', name);
    
    pushParams(newParams, false);
  };

  const updatePriceRange = (min: string | number, max: string | number) => {
    const newParams = new URLSearchParams(localParams);
    if (!min || String(min) === '0') newParams.delete('minPrice');
    else newParams.set('minPrice', String(min));

    if (!max || String(max) === '10000') newParams.delete('maxPrice');
    else newParams.set('maxPrice', String(max));

    newParams.delete('page');
    pushParams(newParams, true); // Debounced for price slider
  };

  const updateSort = (value: string) => {
    const newParams = new URLSearchParams(localParams);
    newParams.set('sort', value);
    newParams.delete('page');
    pushParams(newParams, false);
  };

  return {
    filters: {
      minPrice,
      maxPrice,
      country,
      capacities,
      strengths,
      brands,
      styles,
      promotions,
      sort,
    },
    updateFilter,
    updatePriceRange,
    toggleArrayFilter,
    clearAllFilters,
    updateSort,
  };
};
