import type {
  Product,
  ProductImage,
  ProductRequest,
  WholesalePrice,
} from '@/types/productCard';

export type ProductWholesaleTierFormValue = {
  id: string;
  minQuantity: string;
  price: string;
};

export type ProductFormData = {
  name: string;
  producer: string;
  category: string;
  subcategory: string;
  mainCategory: string;
  description: string;
  countryOfOrigin: string;
  material: string;
  dimensions: string;
  sku: string;
  barcode: string;
  price: string;
  discountPrice: string;
  taxRate: string;
  quantity: string;
  minimumOrderQuantity: string;
  volume: string;
  alcohol: string;
  weight: string;
  tags: string[];
  wholesalePrices: ProductWholesaleTierFormValue[];
};

export const createEmptyProductForm = (): ProductFormData => ({
  name: '',
  producer: '',
  category: '',
  subcategory: '',
  mainCategory: 'NORMAL',
  description: '',
  countryOfOrigin: '',
  material: '',
  dimensions: '',
  sku: '',
  barcode: '',
  price: '',
  discountPrice: '',
  taxRate: '',
  quantity: '',
  minimumOrderQuantity: '1',
  volume: '',
  alcohol: '',
  weight: '',
  tags: [],
  wholesalePrices: [],
});

const toTierId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const createWholesaleTier = (): ProductWholesaleTierFormValue => ({
  id: toTierId(),
  minQuantity: '',
  price: '',
});

const parseNumber = (value: string) => {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const parseInteger = (value: string) => {
  if (value.trim() === '') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

export const mapProductToFormData = (product: Product): ProductFormData => ({
  name: product.name || '',
  producer: product.producer || '',
  category: product.category || '',
  subcategory: product.subcategory || '',
  mainCategory: product.mainCategory || 'NORMAL',
  description: product.description || '',
  countryOfOrigin: product.countryOfOrigin || '',
  material: product.material || '',
  dimensions: product.dimensions || '',
  sku: product.sku || '',
  barcode: product.barcode || '',
  price: String(product.price ?? ''),
  discountPrice:
    typeof product.discountPrice === 'number'
      ? String(product.discountPrice)
      : '',
  taxRate: typeof product.taxRate === 'number' ? String(product.taxRate) : '',
  quantity: String(product.quantity ?? ''),
  minimumOrderQuantity: String(product.minimumOrderQuantity ?? 1),
  volume: String(product.volume ?? ''),
  alcohol: String(product.alcohol ?? ''),
  weight: String(product.weight ?? ''),
  tags: product.tags || [],
  wholesalePrices: (product.wholesalePrices || []).map((tier) => ({
    id: toTierId(),
    minQuantity: String(tier.minQuantity),
    price: String(tier.price),
  })),
});

export const validateProductForm = (formData: ProductFormData) => {
  const errors: Record<string, string> = {};

  const requiredTextFields: Array<[keyof ProductFormData, string]> = [
    ['name', 'Product name is required'],
    ['producer', 'Producer is required'],
    ['category', 'Category is required'],
    ['subcategory', 'Subcategory is required'],
    ['description', 'Description is required'],
    ['countryOfOrigin', 'Country of origin is required'],
    ['sku', 'SKU is required'],
  ];

  requiredTextFields.forEach(([field, message]) => {
    if (typeof formData[field] === 'string' && !formData[field].trim()) {
      errors[field] = message;
    }
  });

  if (formData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  const basePrice = parseNumber(formData.price);
  if (basePrice === null || Number.isNaN(basePrice) || basePrice <= 0) {
    errors.price = 'Base price must be greater than 0';
  }

  const discountPrice = parseNumber(formData.discountPrice);
  if (formData.discountPrice.trim() !== '') {
    if (
      discountPrice === null ||
      Number.isNaN(discountPrice) ||
      discountPrice <= 0
    ) {
      errors.discountPrice = 'Discount price must be greater than 0';
    } else if (
      typeof basePrice === 'number' &&
      !Number.isNaN(basePrice) &&
      discountPrice >= basePrice
    ) {
      errors.discountPrice =
        'Discount price must be lower than the base price';
    }
  }

  const taxRate = parseNumber(formData.taxRate);
  if (
    formData.taxRate.trim() !== '' &&
    (taxRate === null ||
      Number.isNaN(taxRate) ||
      taxRate < 0 ||
      taxRate > 100)
  ) {
    errors.taxRate = 'Tax rate must be between 0 and 100';
  }

  const quantity = parseInteger(formData.quantity);
  if (quantity === null || Number.isNaN(quantity) || quantity < 0) {
    errors.quantity = 'Quantity must be 0 or greater';
  }

  const minOrderQty = parseInteger(formData.minimumOrderQuantity);
  if (minOrderQty === null || Number.isNaN(minOrderQty) || minOrderQty < 1) {
    errors.minimumOrderQuantity =
      'Minimum order quantity must be at least 1';
  }

  const volume = parseNumber(formData.volume);
  if (volume === null || Number.isNaN(volume) || volume <= 0) {
    errors.volume = 'Volume must be greater than 0';
  }

  const alcohol = parseNumber(formData.alcohol);
  if (alcohol === null || Number.isNaN(alcohol) || alcohol < 0 || alcohol > 100) {
    errors.alcohol = 'Alcohol must be between 0 and 100';
  }

  const weight = parseNumber(formData.weight);
  if (weight === null || Number.isNaN(weight) || weight <= 0) {
    errors.weight = 'Weight must be greater than 0';
  }

  const usedQuantities = new Set<number>();
  let previousTierQuantity = 0;
  let previousTierPrice = Number.POSITIVE_INFINITY;

  formData.wholesalePrices.forEach((tier, index) => {
    const minQuantity = parseInteger(tier.minQuantity);
    const tierPrice = parseNumber(tier.price);
    const fieldPrefix = `wholesalePrices.${index}`;

    if (minQuantity === null || Number.isNaN(minQuantity) || minQuantity <= 1) {
      errors[`${fieldPrefix}.minQuantity`] =
        'Minimum quantity for wholesale must be greater than 1';
    }

    if (tierPrice === null || Number.isNaN(tierPrice) || tierPrice <= 0) {
      errors[`${fieldPrefix}.price`] =
        'Wholesale price must be greater than 0';
    }

    if (
      typeof basePrice === 'number' &&
      !Number.isNaN(basePrice) &&
      typeof tierPrice === 'number' &&
      !Number.isNaN(tierPrice) &&
      tierPrice >= basePrice
    ) {
      errors[`${fieldPrefix}.price`] =
        'Wholesale price must be lower than the base price';
    }

    if (
      formData.discountPrice.trim() !== '' &&
      typeof discountPrice === 'number' &&
      !Number.isNaN(discountPrice) &&
      typeof tierPrice === 'number' &&
      !Number.isNaN(tierPrice) &&
      tierPrice > discountPrice
    ) {
      errors[`${fieldPrefix}.price`] =
        'Wholesale price should be lower than or equal to the discount price';
    }

    if (
      typeof minQuantity === 'number' &&
      !Number.isNaN(minQuantity) &&
      usedQuantities.has(minQuantity)
    ) {
      errors[`${fieldPrefix}.minQuantity`] =
        'Wholesale quantity tiers must be unique';
    }

    if (
      typeof minQuantity === 'number' &&
      !Number.isNaN(minQuantity) &&
      typeof tierPrice === 'number' &&
      !Number.isNaN(tierPrice)
    ) {
      if (minQuantity <= previousTierQuantity) {
        errors[`${fieldPrefix}.minQuantity`] =
          'Wholesale tiers must be sorted by increasing quantity';
      }

      if (tierPrice >= previousTierPrice) {
        errors[`${fieldPrefix}.price`] =
          'Larger wholesale quantities must have a lower unit price';
      }

      usedQuantities.add(minQuantity);
      previousTierQuantity = minQuantity;
      previousTierPrice = tierPrice;
    }
  });

  return errors;
};

export const buildProductPayload = (
  formData: ProductFormData,
  uploadedImages: ProductImage[],
): ProductRequest => {
  const sortedWholesalePrices: WholesalePrice[] = formData.wholesalePrices
    .map((tier) => ({
      minQuantity: Number.parseInt(tier.minQuantity, 10),
      price: Number(tier.price),
    }))
    .sort((firstTier, secondTier) => firstTier.minQuantity - secondTier.minQuantity);

  return {
    mainImageId: uploadedImages[0]?.id,
    imageIds: uploadedImages.slice(1).map((image) => image.id),
    name: formData.name.trim(),
    producer: formData.producer.trim(),
    price: Number(formData.price),
    quantity: Number.parseInt(formData.quantity, 10),
    mainCategory: formData.mainCategory as ProductRequest['mainCategory'],
    alcohol: Number(formData.alcohol),
    description: formData.description.trim(),
    category: formData.category as ProductRequest['category'],
    subcategory: formData.subcategory.trim(),
    volume: Number(formData.volume),
    sku: formData.sku.trim(),
    countryOfOrigin: formData.countryOfOrigin.trim(),
    tags: formData.tags,
    minimumOrderQuantity: Number.parseInt(formData.minimumOrderQuantity, 10),
    material: formData.material.trim(),
    discountPrice:
      formData.discountPrice.trim() === ''
        ? undefined
        : Number(formData.discountPrice),
    barcode: formData.barcode.trim(),
    weight: Number(formData.weight),
    dimensions: formData.dimensions.trim(),
    taxRate:
      formData.taxRate.trim() === '' ? undefined : Number(formData.taxRate),
    wholesalePrices: sortedWholesalePrices,
  };
};
