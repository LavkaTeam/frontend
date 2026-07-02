import type { WholesalePrice } from '@/types/productCard';

type PricingSource = {
  price: number;
  discountPrice?: number;
  wholesalePrices?: WholesalePrice[];
};

type ResolvedPricing = {
  discountedPrice: number | null;
  basePrice: number;
  currentUnitPrice: number;
  fromPrice: number;
  hasWholesalePriceRange: boolean;
};

const isValidPrice = (value?: number) => {
  return typeof value === 'number' && value > 0;
};

const buildValidWholesaleTiers = (tiers?: WholesalePrice[]) => {
  return [...(tiers || [])]
    .filter((tier) => tier.minQuantity > 0 && tier.price > 0)
    .sort((firstTier, secondTier) => firstTier.minQuantity - secondTier.minQuantity);
};

const resolvePricing = (
  source: PricingSource,
  quantityInCart: number,
): ResolvedPricing => {
  const hasValidDiscount =
    isValidPrice(source.discountPrice) &&
    typeof source.discountPrice === 'number' &&
    source.discountPrice < source.price;
  const discountedPrice = hasValidDiscount ? source.discountPrice ?? null : null;
  const basePrice = discountedPrice ?? source.price;

  const validWholesaleTiers = buildValidWholesaleTiers(source.wholesalePrices);
  let currentUnitPrice = basePrice;

  for (const tier of validWholesaleTiers) {
    if (quantityInCart >= tier.minQuantity) {
      currentUnitPrice = tier.price;
    }
  }

  const wholesalePrices = validWholesaleTiers.map((tier) => tier.price);
  const fromPrice = wholesalePrices.length
    ? Math.min(basePrice, ...wholesalePrices)
    : basePrice;
  const hasWholesalePriceRange =
    wholesalePrices.length > 0 &&
    new Set([basePrice, ...wholesalePrices].map((price) => price.toFixed(2))).size >
      1;

  return {
    discountedPrice,
    basePrice,
    currentUnitPrice,
    fromPrice,
    hasWholesalePriceRange,
  };
};

export { resolvePricing };
export type { PricingSource, ResolvedPricing };
