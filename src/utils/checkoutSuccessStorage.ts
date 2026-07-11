import type { OrderResponseDto } from '@/types/order';
import type { StoredPaymentBatchContext } from '@/types/payment';

const CHECKOUT_SUCCESS_STORAGE_KEY = 'checkout-success-orders';
const PAYMENT_BATCH_CONTEXT_STORAGE_KEY = 'payment-batch-contexts';

type StoredPaymentBatchContextMap = Record<string, StoredPaymentBatchContext>;

export const saveCheckoutSuccessOrders = (orders: OrderResponseDto[]) => {
  sessionStorage.setItem(
    CHECKOUT_SUCCESS_STORAGE_KEY,
    JSON.stringify(orders),
  );
};

export const getCheckoutSuccessOrders = (): OrderResponseDto[] => {
  const rawValue = sessionStorage.getItem(CHECKOUT_SUCCESS_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as OrderResponseDto[];
  } catch {
    return [];
  }
};

export const clearCheckoutSuccessOrders = () => {
  sessionStorage.removeItem(CHECKOUT_SUCCESS_STORAGE_KEY);
};

const getPaymentBatchContextMap = (): StoredPaymentBatchContextMap => {
  const rawValue = sessionStorage.getItem(PAYMENT_BATCH_CONTEXT_STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as StoredPaymentBatchContextMap;
  } catch {
    return {};
  }
};

const savePaymentBatchContextMap = (
  contexts: StoredPaymentBatchContextMap,
) => {
  sessionStorage.setItem(
    PAYMENT_BATCH_CONTEXT_STORAGE_KEY,
    JSON.stringify(contexts),
  );
};

export const savePaymentBatchContext = (context: StoredPaymentBatchContext) => {
  const contexts = getPaymentBatchContextMap();

  savePaymentBatchContextMap({
    ...contexts,
    [context.batchId]: context,
  });
};

export const getPaymentBatchContext = (batchId?: string) => {
  if (!batchId) {
    return null;
  }

  const contexts = getPaymentBatchContextMap();

  return contexts[batchId] || null;
};

export const updatePaymentBatchStatus = (
  batchId: string,
  paymentStatus: StoredPaymentBatchContext['paymentStatus'],
) => {
  const contexts = getPaymentBatchContextMap();
  const context = contexts[batchId];

  if (!context) {
    return;
  }

  savePaymentBatchContextMap({
    ...contexts,
    [batchId]: {
      ...context,
      paymentStatus,
    },
  });
};
