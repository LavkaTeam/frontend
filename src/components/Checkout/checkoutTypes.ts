import type { CartItemDto } from '@/types/cart';

type NormalizedCartItem = CartItemDto & {
  sellerName: string;
  sellerCompany: string;
};

type SellerGroup = {
  sellerId: string;
  sellerName: string;
  sellerCompany: string;
  items: NormalizedCartItem[];
  subtotal: number;
  totalTax: number;
  total: number;
};

export type { NormalizedCartItem, SellerGroup };
