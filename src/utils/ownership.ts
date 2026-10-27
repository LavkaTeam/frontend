import type { Product, Seller } from '@/types/productCard';
import type { UserResponse } from '@/types/user';

const normalizeValue = (value: string | null | undefined) =>
  value?.trim().toLowerCase() || '';

const isSameSeller = (
  seller: Seller | null | undefined,
  user: UserResponse | null | undefined,
  authenticatedUserId?: string,
) => {
  if (!seller || !user) {
    return false;
  }

  const normalizedSellerId = normalizeValue(String(seller.id));
  const normalizedUserId = normalizeValue(
    authenticatedUserId ? String(authenticatedUserId) : String(user.id),
  );

  if (normalizedSellerId && normalizedUserId && normalizedSellerId === normalizedUserId) {
    return true;
  }

  const normalizedSellerEmail = normalizeValue(seller.email);
  const normalizedUserEmail = normalizeValue(user.email);

  if (
    normalizedSellerEmail &&
    normalizedUserEmail &&
    normalizedSellerEmail === normalizedUserEmail
  ) {
    return true;
  }

  const normalizedSellerCompany = normalizeValue(seller.companyName);
  const normalizedUserCompany = normalizeValue(user.companyName);

  if (
    normalizedSellerCompany &&
    normalizedUserCompany &&
    normalizedSellerCompany === normalizedUserCompany
  ) {
    return true;
  }

  return false;
};

const isOwnProduct = (
  product: Pick<Product, 'seller' | 'sellerId'> | null | undefined,
  user: UserResponse | null | undefined,
  authenticatedUserId?: string,
) => {
  if (!product || !user) return false;

  // Catalog and search results have `sellerId` instead of `seller`.
  const userId = normalizeValue(String(authenticatedUserId || user.id || ''));
  if (product.sellerId && userId && normalizeValue(product.sellerId) === userId) {
    return true;
  }

  return isSameSeller(product.seller, user, authenticatedUserId);
};

// Opens the product right in the seller's editor.
const getManageProductPath = (productId: string) =>
  `/account?tab=products&action=edit&productId=${encodeURIComponent(productId)}`;

export { getManageProductPath, isSameSeller, isOwnProduct };
