import type {
  TransactionResponseDto,
  TransactionStatus,
  TransactionType,
} from '../model/finance.types';

export const TRANSACTION_STATUS_OPTIONS: TransactionStatus[] = [
  'PROCESSING',
  'COMPLETED',
  'FAILED',
];

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  PROCESSING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  ORDER_REVENUE: 'Online order payment',
  PAYOUT: 'Payout',
  PLATFORM_FEE: 'Platform fee',
  FEE_PAYMENT: 'Platform fee payment',
};

export const NEGATIVE_TRANSACTION_TYPES = new Set<TransactionType>([
  'PAYOUT',
  'PLATFORM_FEE',
  'FEE_PAYMENT',
]);

export const TRANSACTION_TYPE_FILTER_OPTIONS: Array<
  { value: 'ALL' | TransactionType; label: string }
> = [
  { value: 'ALL', label: 'All types' },
  { value: 'ORDER_REVENUE', label: 'Online payments' },
  { value: 'PLATFORM_FEE', label: 'Platform fees' },
  { value: 'FEE_PAYMENT', label: 'Fee payments' },
  { value: 'PAYOUT', label: 'Payouts' },
];

export const TRANSACTION_TYPE_FILTER_LABELS: Record<
  'ALL' | TransactionType,
  string
> = {
  ALL: 'All types',
  ORDER_REVENUE: 'Online payments',
  PLATFORM_FEE: 'Platform fees',
  FEE_PAYMENT: 'Fee payments',
  PAYOUT: 'Payouts',
};

export const isTransactionStatus = (
  value: string | null,
): value is TransactionStatus =>
  Boolean(
    value &&
      TRANSACTION_STATUS_OPTIONS.includes(value as TransactionStatus),
  );

export const getFinanceTransactionStatusMeta = (
  transaction: TransactionResponseDto,
): {
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
} => {
  if (transaction.type === 'ORDER_REVENUE') {
    if (transaction.status === 'COMPLETED') {
      return { label: 'Available', tone: 'success' };
    }
    if (transaction.status === 'PROCESSING') {
      return { label: 'Pending', tone: 'warning' };
    }

    return { label: 'Failed', tone: 'danger' };
  }

  if (transaction.type === 'PLATFORM_FEE') {
    if (transaction.status === 'PROCESSING') {
      return { label: 'Due', tone: 'warning' };
    }
    if (transaction.status === 'COMPLETED') {
      return { label: 'Deducted', tone: 'neutral' };
    }

    return { label: 'Failed', tone: 'danger' };
  }

  if (transaction.type === 'FEE_PAYMENT') {
    if (transaction.status === 'COMPLETED') {
      return { label: 'Confirmed', tone: 'success' };
    }
    if (transaction.status === 'PROCESSING') {
      return { label: 'Processing', tone: 'warning' };
    }

    return { label: 'Failed', tone: 'danger' };
  }

  if (transaction.status === 'COMPLETED') {
    return { label: 'Completed', tone: 'success' };
  }
  if (transaction.status === 'PROCESSING') {
    return { label: 'Processing', tone: 'warning' };
  }

  return { label: 'Failed', tone: 'danger' };
};
