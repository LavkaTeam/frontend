import type { Product, WholesalePrice } from '@/types/productCard';

export type WholesaleRange = {
  price: number;
  label: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export const formatProductEnumLabel = (value: string | undefined) => {
  if (!value) return 'N/A';

  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatProductNumberValue = (value: number | undefined, suffix = '') => {
  if (typeof value !== 'number') return 'N/A';
  return `${value}${suffix}`;
};

export const buildWholesaleRanges = (
  basePrice: number,
  minimumOrderQuantity: number,
  tiers: WholesalePrice[],
): WholesaleRange[] => {
  const effectiveMinQuantity = Math.max(1, minimumOrderQuantity);
  const priceBreaks = new Map<number, number>([[effectiveMinQuantity, basePrice]]);

  tiers
    .filter((tier) => tier.minQuantity > 0 && tier.price > 0)
    .sort((firstTier, secondTier) => firstTier.minQuantity - secondTier.minQuantity)
    .forEach((tier) => {
      priceBreaks.set(Math.max(tier.minQuantity, effectiveMinQuantity), tier.price);
    });

  const normalizedBreaks = [...priceBreaks.entries()]
    .sort((firstBreak, secondBreak) => firstBreak[0] - secondBreak[0])
    .reduce<Array<{ minQuantity: number; price: number }>>(
      (accumulator, [minQuantity, price]) => {
        const lastBreak = accumulator[accumulator.length - 1];
        if (!lastBreak || lastBreak.price !== price) {
          accumulator.push({ minQuantity, price });
        }
        return accumulator;
      },
      [],
    );

  return normalizedBreaks.map((tier, index) => {
    const nextTier = normalizedBreaks[index + 1];
    const rangeEnd = nextTier ? nextTier.minQuantity - 1 : null;
    const quantityLabel = nextTier
      ? rangeEnd !== null && rangeEnd > tier.minQuantity
        ? `${tier.minQuantity}-${rangeEnd}`
        : `${tier.minQuantity}`
      : `${tier.minQuantity}+`;

    return { price: tier.price, label: `${quantityLabel} pcs` };
  });
};

export const buildProductSpecifications = (
  product: Product,
  minimumOrderQuantity: number,
): ProductSpecification[] => [
  { label: 'SKU', value: product.sku || 'N/A' },
  { label: 'Country of origin', value: product.countryOfOrigin || 'N/A' },
  { label: 'Main category', value: formatProductEnumLabel(product.mainCategory) },
  { label: 'Category', value: formatProductEnumLabel(product.category) },
  { label: 'Subcategory', value: formatProductEnumLabel(product.subcategory) },
  { label: 'Volume', value: formatProductNumberValue(product.volume, ' L') },
  { label: 'Alcohol', value: formatProductNumberValue(product.alcohol, '%') },
  ...(minimumOrderQuantity > 1
    ? [{ label: 'Minimum order quantity', value: `${minimumOrderQuantity} pcs` }]
    : []),
  { label: 'Material', value: product.material || 'N/A' },
  { label: 'Barcode', value: product.barcode || 'N/A' },
  { label: 'Weight', value: formatProductNumberValue(product.weight, ' kg') },
  { label: 'Tax rate', value: formatProductNumberValue(product.taxRate, '%') },
  { label: 'Dimensions', value: product.dimensions || 'N/A' },
  { label: 'Seller company', value: product.seller.companyName || 'N/A' },
  { label: 'Seller email', value: product.seller.email || 'N/A' },
  { label: 'Seller phone', value: product.seller.phoneNumber || 'N/A' },
];
