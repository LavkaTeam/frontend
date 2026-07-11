import type { SellerGroup } from '@/components/Checkout/checkoutTypes';
import type { CartItemDto } from '@/types/cart';
import { groupBy } from '@/utils/groupBy';
import { getItemSubtotal, getItemTax } from '@/components/Checkout/checkoutUtils';

const normalizeSellerIdentity = (item: CartItemDto) => ({
  ...item,
  sellerName: item.sellerName || item.sellerCompany || 'Independent seller',
  sellerCompany: item.sellerCompany || item.sellerName || 'Independent seller',
});

export const buildSellerGroups = (items: CartItemDto[]): SellerGroup[] => {
  const normalizedItems = items.map(normalizeSellerIdentity);

  return Object.entries(groupBy(normalizedItems, 'sellerName')).map(
    ([sellerName, sellerItems], index) => {
      const subtotal = sellerItems.reduce(
        (sum, item) => sum + getItemSubtotal(item),
        0,
      );
      const totalTax = sellerItems.reduce(
        (sum, item) => sum + getItemTax(item),
        0,
      );

      return {
        sellerId: String(sellerItems[0]?.sellerId || sellerName || `seller-${index}`),
        sellerName,
        sellerCompany: sellerItems[0]?.sellerCompany || sellerName,
        items: sellerItems,
        subtotal,
        totalTax,
        total: subtotal + totalTax,
      };
    },
  );
};
