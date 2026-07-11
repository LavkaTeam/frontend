import type { CartItem } from '@/store/cartSlice';
import type { CartItemDto, CartResponseDto } from '@/types/cart';
import type { ProductImage, WholesalePrice } from '@/types/productCard';
import { resolvePricing } from '@/utils/pricing';

export type CartDisplayItem = {
  id: string;
  name: string;
  price: number;
  mainImage?: ProductImage;
  producer: string;
  volume?: number;
  minimumOrderQuantity?: number;
  sku?: string;
  barcode?: string;
  country?: string;
  alcohol?: number;
  stock?: number;
  discountPrice?: number;
  wholesalePrices?: WholesalePrice[];
  sellerId?: string;
  sellerCompany?: string;
  sellerName?: string;
  quantity: number;
  weight?: number;
  taxRate?: number;
};

export type SellerCartGroup = {
  sellerId: string;
  sellerCompany: string;
  sellerName?: string;
  items: CartDisplayItem[];
  uniqueItems: number;
  totalItems: number;
  subtotal: number;
  totalWeight: number;
  totalTax: number;
  total: number;
};

export const formatCartWeight = (value: number) =>
  Number.isFinite(value) ? value.toFixed(1) : '0.0';

const normalizeTaxRate = (value?: number) => {
  if (!value) return 0;
  return value > 1 ? value / 100 : value;
};

const getDisplayUnitPrice = (item: CartDisplayItem, isAuthenticated: boolean) =>
  isAuthenticated ? item.price : resolvePricing(item, item.quantity).currentUnitPrice;

export const toCartDisplayItems = (
  isAuthenticated: boolean,
  remoteItems: CartItemDto[] | undefined,
  localItems: CartItem[],
): CartDisplayItem[] => {
  if (isAuthenticated) {
    return (remoteItems || []).map((item) => ({
      id: item.productId,
      name: item.name || '',
      price: item.appliedPrice || 0,
      mainImage: item.mainImage ? { id: item.productId, url: item.mainImage } : undefined,
      producer: item.producer || '',
      volume: item.volume || 0,
      minimumOrderQuantity: item.minimumOrderQuantity || 1,
      sku: item.sku,
      barcode: item.barcode,
      country: item.country,
      alcohol: item.alcohol,
      discountPrice: item.discountPrice,
      wholesalePrices: item.wholesalePrices,
      sellerId: item.sellerId,
      sellerCompany: item.sellerCompany,
      sellerName: item.sellerName,
      quantity: item.requestedQuantity,
      taxRate: item.taxRate,
    }));
  }

  return localItems.map((item) => ({
    ...item,
    sellerId: item.seller?.id,
    sellerCompany: item.seller?.companyName,
    sellerName: [item.seller?.firstName, item.seller?.lastName].filter(Boolean).join(' '),
    country: item.countryOfOrigin,
  }));
};

export const buildSellerCartGroups = (
  items: CartDisplayItem[],
  isAuthenticated: boolean,
): SellerCartGroup[] => items.reduce<SellerCartGroup[]>((groups, item) => {
  const unitPrice = getDisplayUnitPrice(item, isAuthenticated);
  const sellerId = item.sellerId || `local-${item.id}`;
  const sellerCompany = item.sellerCompany || item.sellerName || 'Independent seller';
  const existingGroup = groups.find((group) => group.sellerId === sellerId);
  const subtotal = unitPrice * item.quantity;
  const totalWeight = (item.weight || 0) * item.quantity;
  const totalTax = subtotal * normalizeTaxRate(item.taxRate);

  if (existingGroup) {
    existingGroup.items.push(item);
    existingGroup.uniqueItems += 1;
    existingGroup.totalItems += item.quantity;
    existingGroup.subtotal += subtotal;
    existingGroup.totalWeight += totalWeight;
    existingGroup.totalTax += totalTax;
    existingGroup.total += subtotal + totalTax;
    return groups;
  }

  groups.push({
    sellerId,
    sellerCompany,
    sellerName: item.sellerName,
    items: [item],
    uniqueItems: 1,
    totalItems: item.quantity,
    subtotal,
    totalWeight,
    totalTax,
    total: subtotal + totalTax,
  });
  return groups;
}, []);

export const getCartTotals = (
  isAuthenticated: boolean,
  remoteCart: CartResponseDto | undefined,
  localItems: CartItem[],
) => {
  if (isAuthenticated && remoteCart?.summary) {
    const subtotal = remoteCart.summary.subtotal || 0;
    return {
      subTotal: subtotal,
      dph: remoteCart.summary.totalTax || subtotal * 0.21,
      total: remoteCart.summary.grandTotal || 0,
      totalItems: remoteCart.summary.totalItems ?? remoteCart.items.reduce((sum, item) => sum + item.requestedQuantity, 0),
      totalWeight: remoteCart.summary.totalWeight || 0,
    };
  }

  const subTotal = localItems.reduce(
    (sum, item) => sum + resolvePricing(item, item.quantity).currentUnitPrice * item.quantity,
    0,
  );
  return {
    subTotal,
    dph: subTotal * 0.21,
    total: subTotal * 1.21,
    totalItems: localItems.reduce((sum, item) => sum + item.quantity, 0),
    totalWeight: localItems.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0),
  };
};
