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
  product: Pick<Product, 'seller'> | null | undefined,
  user: UserResponse | null | undefined,
  authenticatedUserId?: string,
) => isSameSeller(product?.seller, user, authenticatedUserId);

export { isSameSeller, isOwnProduct };
