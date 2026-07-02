export const COUNTRY_EXCEPTIONS: Record<string, string> = {
  USA: 'us',
  'Great Britain': 'gb',
  Bohemia: 'cz', // Historical region in Czechia
  Scotland: 'gb-sct', // Sub-region, works with circle-flags
  UK: 'gb',
  'United States': 'us',
  Netherlands: 'nl',
  'Czech Republic': 'cz',
  Czechia: 'cz',
};

export const STRENGTH_DICTIONARY: Record<
  string,
  { label: string; subTitle: string }
> = {
  '0-0.5': { label: 'Non-alcoholic', subTitle: '0-0.5% ABV' },
  '0.5-7.9': { label: '0.5 - 7.9%', subTitle: 'Light - beer, cider' },
  '8-19.9': { label: '8 - 19.9%', subTitle: 'Medium - wine, liqueurs' },
  '20-39.9': { label: '20 - 39.9%', subTitle: 'Strong - vodka, rum, gin' },
  '40-100': { label: '40%+', subTitle: 'Extra strong - absinthe, spirits' },
};
