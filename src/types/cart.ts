import type { WholesalePrice } from './productCard';

export interface CartItemRequestDto {
  productId: string;
  requestedQuantity: number;
}

export interface CartSyncRequestDto {
  items: CartItemRequestDto[];
}

export interface CartUpdateRequestDto {
  requestedQuantity: number;
}

export interface CartItemDto {
  productId: string;
  sku?: string;
  barcode?: string;
  name?: string;
  mainImage?: string;
  minimumOrderQuantity?: number;
  sellerId?: string;
  sellerName?: string;
  sellerCompany?: string;
  requestedQuantity: number;
  volume?: number;
  alcohol?: number;
  producer?: string;
  country?: string;
  stock?: number;
  taxRate?: number;
  appliedPrice?: number;
  totalPrice?: number;
  originalPrice?: number;
  priceType?: 'RETAIL' | 'WHOLESALE' | 'DISCOUNT';
  itemSubtotal?: number;
  itemTax?: number;
  itemWeight?: number;
  availableStock?: number;
  isAvailable?: boolean;
  discountPrice?: number;
  wholesalePrices?: WholesalePrice[];
}

export interface CartSummaryDto {
  totalItems: number;
  totalWeight?: number;
  subtotal: number;
  totalTax?: number;
  grandTotal: number;
}

export interface CartResponseDto {
  cartId: string;
  items: CartItemDto[];
  summary: CartSummaryDto;
}
