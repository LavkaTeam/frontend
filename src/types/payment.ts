import type { OrderPaymentMethod, PaymentStatus } from './order';

export interface DemoPaymentSessionDto {
  checkoutUrl: string;
}

export interface StoredPaymentBatchContext {
  batchId: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  currency: string;
  orderIds: string[];
  orderNumbers: string[];
}
