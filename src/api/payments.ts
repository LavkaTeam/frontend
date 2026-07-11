import { fetchData } from './fetchData';
import type { OrderResponseDto } from '@/types/order';
import type { DemoPaymentSessionDto } from '@/types/payment';

const normalizeCheckoutUrl = (checkoutUrl: string) => {
  if (typeof window === 'undefined') {
    return checkoutUrl;
  }

  try {
    const resolvedUrl = new URL(checkoutUrl, window.location.origin);
    const isInternalPaymentPath =
      resolvedUrl.pathname.startsWith('/mock-payment/') ||
      resolvedUrl.pathname.startsWith('/payment/');

    if (isInternalPaymentPath) {
      return `${window.location.origin}${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
    }

    return resolvedUrl.toString();
  } catch {
    return checkoutUrl;
  }
};

export const createDemoPaymentSession = (
  batchId: string,
): Promise<DemoPaymentSessionDto> =>
  fetchData<string>(`/orders/batches/${batchId}/demo-session`, {
    method: 'POST',
  }).then((checkoutUrl) => ({
    checkoutUrl: normalizeCheckoutUrl(checkoutUrl),
  }));

export const completeDemoPayment = (batchId: string): Promise<string> =>
  fetchData<string>(`/demo-payments/${batchId}/success`, {
    method: 'POST',
  });

export const failDemoPayment = (batchId: string): Promise<string> =>
  fetchData<string>(`/demo-payments/${batchId}/fail`, {
    method: 'POST',
  });

export const completeSellerOrder = (
  orderId: string,
): Promise<OrderResponseDto> =>
  fetchData<OrderResponseDto>(`/orders/seller/${orderId}/complete`, {
    method: 'POST',
  });
