import { getCode } from 'country-list';
import { COUNTRY_EXCEPTIONS } from '@/data/filtersData';

/**
 * Returns the URL for a circular country flag SVG based on the country name.
 * Uses a mapping of exceptions first, then falls back to country-list ISO codes, 
 * and finally to a local fallback globe icon.
 * 
 * @param countryName - The name of the country (e.g., "United States", "USA", "Bohemia")
 * @returns {string} The full URL to the SVG flag from circle-flags CDN or local fallback.
 */
export const getCountryFlagUrl = (countryName: string): string => {
  if (!countryName) return '/icons/fallback-globe.svg';
  
  const lowerName = countryName.toLowerCase();
  
  // 1. Check direct exceptions (e.g., Bohemia -> cz)
  for (const [key, code] of Object.entries(COUNTRY_EXCEPTIONS)) {
    if (key.toLowerCase() === lowerName) {
      return `https://hatscripts.github.io/circle-flags/flags/${code.toLowerCase()}.svg`;
    }
  }

  // 2. Use standard country-list lookup for ISO code
  const isoCode = getCode(countryName);
  if (isoCode) {
    return `https://hatscripts.github.io/circle-flags/flags/${isoCode.toLowerCase()}.svg`;
  }

  // 3. Final Fallback
  return '/icons/fallback-globe.svg';
};
