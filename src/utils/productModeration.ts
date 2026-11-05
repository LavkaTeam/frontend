import type { Product, ProductStatus } from '@/types/productCard';

export type ModerationNoticeKind = 'REJECTED' | 'BLOCKED' | 'UNDER_REVIEW';

export interface ModerationNotice {
  kind: ModerationNoticeKind;
  title: string;
  text: string;
  reason?: string;
}

type ModerationFields = Pick<
  Product,
  'adminBlocked' | 'moderationReason' | 'moderationStatus'
> & { status: ProductStatus };

/**
 * What the owner (and the admin) should be told about a product's moderation:
 * blocked and rejected products carry a reason; a waiting one explains that it
 * is not in the catalog yet. Null for products that need no explanation.
 */
export const getModerationNotice = (
  product: ModerationFields | null | undefined,
): ModerationNotice | null => {
  if (!product) return null;

  if (product.adminBlocked || product.moderationStatus === 'BLOCKED') {
    return {
      kind: 'BLOCKED',
      title: 'Blocked by a moderator',
      text: 'The product is hidden from the catalog and cannot be activated until the block is lifted. You can still fix the details; to dispute the decision, write to support@b2bar.tech.',
      reason: product.moderationReason,
    };
  }

  if (product.moderationStatus === 'REJECTED') {
    return {
      kind: 'REJECTED',
      title: 'Rejected by a moderator',
      text: 'The product is hidden from the catalog. Fix what the moderator asks for and save: the product then goes to review again.',
      reason: product.moderationReason,
    };
  }

  if (product.status === 'UNDER_REVIEW') {
    return {
      kind: 'UNDER_REVIEW',
      title: 'Waiting for review',
      text: 'A moderator checks new and edited products. It appears in the catalog once approved, and you get an email with the decision.',
    };
  }

  return null;
};
