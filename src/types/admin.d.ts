// Admin API (/api/admin/**). Source of truth:
// LAVKA_BACKEND/backend/docs/8-admin.md and docs/swagger.json.
import type { OrderPaymentMethod } from './order';
import type {
  ModerationStatus,
  ProductImage,
  ProductStatus,
} from './productCard';
import type { Address, VerificationStatus } from './user';

export interface AdminPage<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminPageParams {
  page?: number;
  size?: number;
}

// Every decision notifies the user by email; a failed email never undoes it.
export interface AdminEmailResult {
  emailSent: boolean;
}

/* ---------- Dashboard ---------- */

export interface AdminStats {
  users: {
    total: number;
    buyers: number;
    sellers: number;
    banned: number;
    byVerificationStatus: Partial<Record<VerificationStatus, number>>;
  };
  queues: {
    pendingVerifications: number;
    pendingPayouts: number;
    blockedProducts: number;
    productsToReview: number;
  };
  orders: {
    total: number;
    byStatus: Partial<Record<AdminOrderStatus, number>>;
    byPaymentStatus: Partial<Record<AdminPaymentStatus, number>>;
  };
  products: {
    total: number;
    byStatus: Partial<Record<ProductStatus, number>>;
  };
}

/* ---------- Users ---------- */

export type AdminUserRole = 'BUYER' | 'SELLER';
export type AdminUserSort = 'newest' | 'oldest';

export interface AdminUserListParams extends AdminPageParams {
  role?: AdminUserRole;
  status?: VerificationStatus;
  banned?: boolean;
  q?: string;
  sort?: AdminUserSort;
}

export interface AdminUserListItem {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phoneNumber?: string;
  role: AdminUserRole;
  verificationStatus: VerificationStatus;
  profileComplete: boolean;
  banned: boolean;
  registeredAt: string;
}

export interface AdminUserDetails extends AdminUserListItem {
  verificationRejectionReason?: string;
  verificationReviewedAt?: string;
  // Backend names: legalAddress.* for the legal address fields.
  missingFields: string[];
  logoUrl?: string;
  registrationNumber?: string;
  taxId?: string;
  vatNumber?: string;
  liquorLicenseNumber?: string;
  hasLicenseDocument: boolean;
  bankName?: string;
  iban?: string;
  bic?: string;
  legalAddress?: Address;
  productsCount: number;
  ordersAsBuyer: number;
  ordersAsSeller: number;
}

export type AdminVerificationDecision = 'VERIFIED' | 'REJECTED';

export interface AdminVerificationRequest {
  verificationStatus: AdminVerificationDecision;
  // Required for REJECTED, 10-500 characters; emailed to the user.
  reason?: string;
}

export interface AdminVerificationResponse extends AdminEmailResult {
  user: AdminUserDetails;
}

export interface AdminBanRequest {
  reason?: string;
}

/* ---------- Payouts ---------- */

export type AdminPayoutStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface AdminPayoutListParams extends AdminPageParams {
  status?: AdminPayoutStatus;
  sellerId?: string;
}

export interface AdminPayout {
  id: string;
  sellerId: string;
  sellerCompany?: string;
  sellerName?: string;
  sellerEmail?: string;
  amount: number;
  currency: string;
  status: AdminPayoutStatus;
  // Snapshot taken when the seller requested the payout: pay to these.
  bankName?: string;
  iban?: string;
  bic?: string;
  createdAt: string;
  processedAt?: string;
  processedByAdminId?: string;
  adminComment?: string;
}

export interface AdminPayoutDecisionResponse extends AdminEmailResult {
  payout: AdminPayout;
}

export interface AdminRejectPayoutRequest {
  // 5-500 characters; emailed to the seller.
  comment: string;
}

export interface AdminPayFeesRequest {
  amount: number;
}

export interface AdminPayFeesResponse {
  sellerId: string;
  amount: number;
  platformFeesDueAfter: number;
}

/* ---------- Orders ---------- */

export type AdminOrderStatus =
  'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';

export type AdminPaymentStatus =
  'AWAITING_PAYMENT' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface AdminOrderListParams extends AdminPageParams {
  status?: AdminOrderStatus;
  paymentStatus?: AdminPaymentStatus;
  sellerId?: string;
  buyerId?: string;
  q?: string;
  // YYYY-MM-DD, both inclusive.
  from?: string;
  to?: string;
}

export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderStatus: AdminOrderStatus;
  paymentStatus: AdminPaymentStatus;
  paymentMethod: OrderPaymentMethod;
  summary: {
    subtotal?: number;
    totalTax?: number;
    shippingCost?: number;
    grandTotal: number;
  };
  itemsCount: number;
  buyerId: string;
  buyerCompany?: string;
  buyerName?: string;
  buyerEmail?: string;
  sellerId: string;
  sellerCompany?: string;
  sellerName?: string;
}

/* ---------- Products ---------- */

export interface AdminProductListParams extends AdminPageParams {
  status?: ProductStatus;
  sellerId?: string;
  blocked?: boolean;
  q?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  volume?: number;
  producer?: string;
  price: number;
  category?: string;
  status: ProductStatus;
  adminBlocked: boolean;
  moderationReason?: string;
  moderationStatus?: ModerationStatus | null;
  quantity: number;
  mainImage?: ProductImage;
  subcategory?: string;
  country?: string;
}

export interface AdminProductListItem {
  product: AdminProduct;
  sellerId: string;
  sellerCompany?: string;
  sellerEmail?: string;
  createdAt: string;
}

export interface AdminRefundOrderRequest {
  // 10-500 characters; emailed to the buyer and the seller.
  reason: string;
}

export interface AdminRefundOrderResponse extends AdminEmailResult {
  order: AdminOrderListItem;
}

export interface AdminProductModerationResponse extends AdminEmailResult {
  item: AdminProductListItem;
}

export interface AdminRejectProductRequest {
  // 10-500 characters; emailed to the seller.
  reason: string;
}

export interface AdminBlockProductRequest {
  // 10-500 characters; emailed to the seller.
  reason: string;
}

/* ---------- Audit log ---------- */

export type AdminAuditAction =
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'
  | 'USER_BANNED'
  | 'USER_RESTORED'
  | 'LICENSE_VIEWED'
  | 'PAYOUT_APPROVED'
  | 'PAYOUT_REJECTED'
  | 'FEES_PAID'
  | 'PRODUCT_BLOCKED'
  | 'PRODUCT_UNBLOCKED'
  | 'PRODUCT_APPROVED'
  | 'PRODUCT_REJECTED'
  | 'ORDER_STATUS_CHANGED'
  | 'DOCUMENT_GENERATED'
  | 'ORDER_REFUNDED';

export type AdminAuditTargetType =
  'USER' | 'PAYOUT' | 'PRODUCT' | 'SELLER' | 'ORDER';

export interface AdminAuditListParams extends AdminPageParams {
  action?: AdminAuditAction;
  targetId?: string;
}

export interface AdminAuditEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: AdminAuditAction;
  targetType: AdminAuditTargetType;
  targetId: string;
  targetLabel?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}
