import type {
  DeliveryType,
  OrderPaymentMethod,
  PlatformFeeBaseType,
  OrderResponseDto,
  OrderResponseItemDto,
  OrderStatus,
  PaymentStatus,
} from '@/types/order';

const ORDER_STATUS_OPTIONS: OrderResponseDto['orderStatus'][] = [
  'NEW',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'New',
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  AWAITING_PAYMENT: 'Awaiting payment',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

const PAYMENT_METHOD_LABELS: Record<OrderPaymentMethod, string> = {
  INVOICE: 'Invoice',
  CASH_ON_DELIVERY: 'Cash on delivery',
  CARD_ONLINE: 'Online card payment',
  DEFERRED_PAYMENT: 'Deferred payment',
};

const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  COURIER: 'Courier delivery',
  WAREHOUSE: 'Warehouse pickup',
};

const PRICE_TYPE_LABELS: Record<
  NonNullable<OrderResponseItemDto['priceType']>,
  string
> = {
  RETAIL: 'Retail',
  WHOLESALE: 'Wholesale',
  DISCOUNT: 'Discount',
};

export const isOrderStatus = (value: string): value is OrderResponseDto['orderStatus'] =>
  ORDER_STATUS_OPTIONS.includes(value as OrderResponseDto['orderStatus']);

export const formatOrderStatus = (status: OrderStatus) =>
  ORDER_STATUS_LABELS[status] || status;

export const formatPaymentStatus = (status: PaymentStatus) =>
  PAYMENT_STATUS_LABELS[status] || status;

export const formatPaymentMethod = (method: OrderPaymentMethod) =>
  PAYMENT_METHOD_LABELS[method] || method;

export const canRetryOnlinePayment = ({
  paymentMethod,
  paymentStatus,
  paymentBatchId,
}: {
  paymentMethod?: OrderPaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentBatchId?: string;
}) =>
  paymentMethod === 'CARD_ONLINE' &&
  Boolean(paymentBatchId) &&
  (paymentStatus === 'AWAITING_PAYMENT' || paymentStatus === 'FAILED');

export const formatDeliveryType = (type: DeliveryType) =>
  DELIVERY_TYPE_LABELS[type] || type;

export const formatPriceType = (
  type?: OrderResponseItemDto['priceType'],
) => (type ? PRICE_TYPE_LABELS[type] || type : null);

export const formatOrderDate = (dateString: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const formatOrderDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value || 0);

export const formatPlatformFeeBaseType = (value: PlatformFeeBaseType) => {
  switch (value) {
    case 'SUBTOTAL':
      return 'Subtotal';
    case 'GRAND_TOTAL':
      return 'Grand total';
    default:
      return value;
  }
};

export const getDeliveryAddressLabel = (order: OrderResponseDto) => {
  const { shippingDetails } = order;

  return shippingDetails.deliveryType === 'COURIER'
    ? [shippingDetails.city, shippingDetails.addressLine]
        .filter(Boolean)
        .join(', ')
    : [shippingDetails.city, shippingDetails.warehouseNumber]
        .filter(Boolean)
        .join(', ');
};

export { ORDER_STATUS_OPTIONS };
