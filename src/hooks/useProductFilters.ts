import { useSearchParams } from 'react-router-dom';

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Отримуємо поточні значення
  const priceFrom = searchParams.get('priceFrom') || '';
  const priceTo = searchParams.get('priceTo') || '';
  const country = searchParams.get('country') || '';
  const promotions = searchParams.get('promotions') === 'true';

  // Для чекбоксів (може бути декілька значень)
  const capacities = searchParams.getAll('capacity');
  const strengths = searchParams.getAll('strength');

  // Універсальна функція оновлення
  const updateFilter = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      newParams.delete('page');
      return newParams;
    });
  };

  // Логіка для чекбоксів
  const toggleArrayFilter = (key: string, value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
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
      return newParams;
    });
  };

  const clearAllFilters = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('priceFrom');
      newParams.delete('priceTo');
      newParams.delete('country');
      newParams.delete('capacity');
      newParams.delete('strength');
      newParams.delete('promotions');
      newParams.delete('page');
      return newParams;
    });
  };

  return {
    filters: { priceFrom, priceTo, country, capacities, strengths, promotions },
    updateFilter,
    toggleArrayFilter,
    clearAllFilters,
  };
};
