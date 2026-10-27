import type { BadgeTone } from '@/components/ui/StatusBadge';
import {
  PROFILE_FIELD_LABELS,
  toProfileFieldKey,
} from '@/features/account/profile';
import type {
  AdminAuditAction,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminPayoutStatus,
  AdminUserRole,
} from '@/types/admin';
import type { ProductStatus } from '@/types/productCard';
import type { VerificationStatus } from '@/types/user';

interface StatusMeta {
  label: string;
  tone: BadgeTone;
}

export const VERIFICATION_STATUS: Record<VerificationStatus, StatusMeta> = {
  NOT_VERIFIED: { label: 'Not submitted', tone: 'gray' },
  PENDING: { label: 'In review', tone: 'amber' },
  VERIFIED: { label: 'Verified', tone: 'green' },
  REJECTED: { label: 'Rejected', tone: 'burgundy' },
};

export const ROLE_LABELS: Record<AdminUserRole, string> = {
  BUYER: 'Buyer',
  SELLER: 'Seller',
};

export const PAYOUT_STATUS: Record<AdminPayoutStatus, StatusMeta> = {
  PENDING: { label: 'Pending', tone: 'amber' },
  COMPLETED: { label: 'Paid out', tone: 'green' },
  REJECTED: { label: 'Rejected', tone: 'burgundy' },
};

export const ORDER_STATUS: Record<AdminOrderStatus, StatusMeta> = {
  NEW: { label: 'New', tone: 'gray' },
  PROCESSING: { label: 'Processing', tone: 'amber' },
  SHIPPED: { label: 'Shipped', tone: 'orange' },
  DELIVERED: { label: 'Delivered', tone: 'green' },
  COMPLETED: { label: 'Completed', tone: 'green' },
  CANCELLED: { label: 'Cancelled', tone: 'burgundy' },
};

export const PAYMENT_STATUS: Record<AdminPaymentStatus, StatusMeta> = {
  AWAITING_PAYMENT: { label: 'Awaiting payment', tone: 'gray' },
  PAID: { label: 'Paid', tone: 'green' },
  FAILED: { label: 'Failed', tone: 'burgundy' },
  REFUNDED: { label: 'Refunded', tone: 'burgundy' },
};

export const PRODUCT_STATUS: Record<ProductStatus, StatusMeta> = {
  ACTIVE: { label: 'Active', tone: 'green' },
  HIDDEN: { label: 'Hidden', tone: 'gray' },
  UNDER_REVIEW: { label: 'Under review', tone: 'amber' },
  ARCHIVED: { label: 'Archived', tone: 'burgundy' },
};

export const AUDIT_ACTION: Record<AdminAuditAction, StatusMeta> = {
  VERIFICATION_APPROVED: { label: 'Company approved', tone: 'green' },
  VERIFICATION_REJECTED: { label: 'Company rejected', tone: 'burgundy' },
  USER_BANNED: { label: 'User banned', tone: 'burgundy' },
  USER_RESTORED: { label: 'User restored', tone: 'green' },
  LICENSE_VIEWED: { label: 'License viewed', tone: 'gray' },
  PAYOUT_APPROVED: { label: 'Payout approved', tone: 'green' },
  PAYOUT_REJECTED: { label: 'Payout rejected', tone: 'burgundy' },
  FEES_PAID: { label: 'Fees paid', tone: 'orange' },
  PRODUCT_BLOCKED: { label: 'Product blocked', tone: 'burgundy' },
  PRODUCT_UNBLOCKED: { label: 'Product unblocked', tone: 'green' },
  PRODUCT_APPROVED: { label: 'Product approved', tone: 'green' },
  PRODUCT_REJECTED: { label: 'Product rejected', tone: 'burgundy' },
  ORDER_STATUS_CHANGED: { label: 'Order status changed', tone: 'orange' },
  DOCUMENT_GENERATED: { label: 'Document generated', tone: 'gray' },
  ORDER_REFUNDED: { label: 'Order refunded', tone: 'burgundy' },
};

export const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

export const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export const formatMoney = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatPersonName = (firstName?: string, lastName?: string) =>
  [firstName, lastName].filter(Boolean).join(' ') || '—';

// Backend names (legalAddress.zipCode) → profile form labels.
export const formatMissingField = (field: string) =>
  PROFILE_FIELD_LABELS[toProfileFieldKey(field)] || field;

// Groups an IBAN in blocks of four for reading it off the screen.
export const formatIban = (iban?: string) =>
  iban
    ? iban
        .replace(/\s/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
    : '—';
