import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const ADMIN_PAGE_SIZE = 20;

/**
 * Filters and the page of an admin list, kept in the URL so a filtered view
 * can be linked to (e.g. from the dashboard) and survives a reload.
 * The page is 1-based in the URL and 0-based for the API.
 */
export const useListSearchParams = <K extends string>(keys: readonly K[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = Object.fromEntries(
    keys.map((key) => [key, searchParams.get(key) ?? '']),
  ) as Record<K, string>;
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);

  const setFilter = useCallback(
    (key: K, value: string) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value) next.set(key, value);
          else next.delete(key);
          // A new filter starts from the first page.
          next.delete('page');
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        if (nextPage > 1) next.set('page', String(nextPage));
        else next.delete('page');
        return next;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const hasFilters = keys.some((key) => Boolean(filters[key]));

  return {
    filters,
    page,
    apiPage: page - 1,
    setFilter,
    setPage,
    clearFilters,
    hasFilters,
  };
};
