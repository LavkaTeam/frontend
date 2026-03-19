import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export const useTableSort = <T extends Record<string, any>>(data: T[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let valA: string | number = a[sortConfig.key] as unknown as
          | string
          | number;
        let valB: string | number = b[sortConfig.key] as unknown as
          | string
          | number;

        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
        if (typeof valA === 'string' && dateRegex.test(valA)) {
          const [aDay, aMonth, aYear] = valA.split('.');
          const [bDay, bMonth, bYear] = (valB as string).split('.');

          valA = new Date(`${aYear}-${aMonth}-${aDay}`).getTime();
          valB = new Date(`${bYear}-${bMonth}-${bDay}`).getTime();
        }

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  return { sortedData, sortConfig, requestSort };
};
