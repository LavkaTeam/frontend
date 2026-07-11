import { describe, expect, it } from 'vitest';

import { buildSellerCartGroups, getCartTotals, type CartDisplayItem } from './cartView';

const item = (overrides: Partial<CartDisplayItem> = {}): CartDisplayItem => ({
  id: 'product-1',
  name: 'Product',
  price: 100,
  producer: 'Producer',
  quantity: 2,
  sellerId: 'seller-1',
  sellerCompany: 'Seller',
  taxRate: 21,
  ...overrides,
});

describe('cart view model', () => {
  it('groups seller items and calculates their tax-inclusive totals', () => {
    const groups = buildSellerCartGroups(
      [item(), item({ id: 'product-2', price: 50, quantity: 1 })],
      true,
    );

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({
      uniqueItems: 2,
      totalItems: 3,
      subtotal: 250,
      totalTax: 52.5,
      total: 302.5,
    });
  });

  it('uses backend cart summary when it is available', () => {
    const totals = getCartTotals(
      true,
      {
        cartId: 'cart-1',
        items: [{ productId: 'product-1', requestedQuantity: 3 }],
        summary: { totalItems: 3, subtotal: 200, totalTax: 42, grandTotal: 242 },
      },
      [],
    );

    expect(totals).toEqual({
      subTotal: 200,
      dph: 42,
      total: 242,
      totalItems: 3,
      totalWeight: 0,
    });
  });
});
