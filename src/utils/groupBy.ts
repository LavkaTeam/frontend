export const groupBy = <T, K extends keyof T>(
  items: T[],
  key: K,
): Record<string, T[]> => {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const groupKey = String(item[key] ?? 'Unknown');

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(item);

    return groups;
  }, {});
};
