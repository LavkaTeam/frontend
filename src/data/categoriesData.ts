import type { Category } from '../types/categoryTypes';

export const categories: Category[] = [
  {
    id: 1,
    name: 'Wine',
    subcategories: [
      { id: 1, name: 'Red Wine' },
      { id: 2, name: 'White Wine' },
      { id: 3, name: 'Rosé Wine' },
    ],
  },
  {
    id: 2,
    name: 'Beer',
    subcategories: [
      { id: 1, name: 'Lager' },
      { id: 2, name: 'Ale' },
      { id: 3, name: 'Stout' },
    ],
  },
  {
    id: 3,
    name: 'Strong Drinks',
    subcategories: [
      { id: 1, name: 'Whiskey' },
      { id: 2, name: 'Vodka' },
      { id: 3, name: 'Tequila' },
    ],
  },
  {
    id: 4,
    name: 'Low alcohol Drinks',
    subcategories: [
      { id: 1, name: 'Cider' },
      { id: 2, name: 'Light Beer' },
      { id: 3, name: 'Wine Cooler' },
    ],
  },
  {
    id: 5,
    name: 'Soft Drinks',
    subcategories: [
      { id: 1, name: 'Cola' },
      { id: 2, name: 'Lemonade' },
      { id: 3, name: 'Ice tea' },
    ],
  },
];