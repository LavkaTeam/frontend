import type { Category } from '@/types/categoryTypes';

export const categories: Category[] = [
  {
    id: 'WINE',
    label: 'Wine',
    subcategories: [
      { id: 'RED', label: 'Red' },
      { id: 'WHITE', label: 'White' },
      { id: 'PINK', label: 'Rosé' },
      { id: 'SPARKLING', label: 'Sparkling' },
      { id: 'DESSERT', label: 'Dessert' },
      { id: 'FORTIFIED', label: 'Fortified' },
    ],
  },
  {
    id: 'BEER',
    label: 'Beer',
    subcategories: [
      { id: 'LIGHT', label: 'Light' },
      { id: 'DARK', label: 'Dark' },
      { id: 'CRAFT', label: 'Craft' },
      { id: 'NON_ALCOHOLIC', label: 'Non-Alcoholic' },
    ],
  },
  {
    id: 'STRONG_DRINKS',
    label: 'Strong Drinks',
    subcategories: [
      { id: 'WHISKEY', label: 'Whiskey' },
      { id: 'VODKA', label: 'Vodka' },
      { id: 'GIN', label: 'Gin' },
      { id: 'RUM', label: 'Rum' },
      { id: 'COGNAC', label: 'Cognac' },
      { id: 'BRANDY', label: 'Brandy' },
      { id: 'TINCTURES', label: 'Tinctures' },
      { id: 'LIQUEURS', label: 'Liqueurs' },
    ],
  },
  {
    id: 'LOW_ALCOHOL_DRINKS',
    label: 'Low Alcohol',
    subcategories: [
      { id: 'COCKTAILS_IN_CANS', label: 'Canned Cocktails' },
      { id: 'ALCOPOPS', label: 'Alcopops' },
      { id: 'VERMOUTH', label: 'Vermouth' },
      { id: 'APERITIFS', label: 'Aperitifs' },
    ],
  },
  {
    id: 'SOFT_DRINKS',
    label: 'Soft Drinks',
    subcategories: [
      { id: 'TONICS', label: 'Tonics' },
      { id: 'MIXERS', label: 'Mixers' },
      { id: 'CARBONATED_DRINKS', label: 'Carbonated Drinks' },
      { id: 'JUICES_IN_COCKTAILS', label: 'Cocktail Juices' },
    ],
  },
  {
    id: 'BARWARE_ACCESSORIES',
    label: 'Accessories',
    subcategories: [
      { id: 'GLASSWARE', label: 'Glassware' },
      { id: 'BAR_TOOLS', label: 'Bar Tools' },
      { id: 'CHILLERS', label: 'Chillers' },
      { id: 'DECOR_ITEMS', label: 'Decor' },
      { id: 'SERVING_GEAR', label: 'Serving Gear' },
    ],
  },
];
