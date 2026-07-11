import { UserRole } from './user';

export type OrderStatus =
  | 'NEW'
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productVolume: string;
  productProducer: string;
  productPackaging: string;

  // Поки немає в API, але треба для дизайну
  productImage?: string;
}

export interface Order {
  orderId: string;
  userId: string;
  orderItems: OrderItem[];
  orderTotalPrice: number;
  orderStatus: OrderStatus;
  orderCreatedAt: string;
  orderUpdatedAt: string;

  // Поля для UI, яких поки немає в API orders/{id}
  deliveryAddress?: string;
  deliveryType?: string;
  paymentMethod?: string;
  expectedDeliveryTime?: string;
}

export type OrderPaymentMethod =
  | 'INVOICE'
  | 'CASH_ON_DELIVERY'
  | 'CARD_ONLINE'
  | 'DEFERRED_PAYMENT';

export type DeliveryType = 'COURIER' | 'WAREHOUSE';
export type PaymentStatus =
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';
export type OrderDocumentType =
  | 'PURCHASE_ORDER'
  | 'DELIVERY_NOTE'
  | 'PROFORMA_INVOICE'
  | 'INVOICE'
  | 'SELLER_SETTLEMENT_STATEMENT';
export type DocumentStatus = 'PENDING' | 'GENERATED' | 'FAILED';
export type PlatformFeeBaseType = 'SUBTOTAL' | 'GRAND_TOTAL' | string;
export type PlatformFeeStatus = 'PENDING' | 'COMPLETED' | string;

export interface ShippingDetailsDto {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  deliveryType: DeliveryType;
  warehouseNumber?: string;
  addressLine?: string;
  trackingNumber?: string;
}

export interface BillingDetailsDto {
  companyName: string;
  registrationNumber: string;
  taxId: string;
  iban: string;
  bankName: string;
  legalAddress: string;
}

export interface OrderRequestDto {
  paymentMethod: OrderPaymentMethod;
  shippingDetails: ShippingDetailsDto;
  orderComment?: string;
}

export interface OrderSummaryDto {
  totalItems: number;
  totalWeight?: number;
  subtotal: number;
  totalTax: number;
  shippingCost?: number;
  shippingCostDisplay?: string;
  grandTotal: number;
}

export interface PlatformFeeInfoDto {
  rate: number;
  base: number;
  baseType: PlatformFeeBaseType;
  amount: number;
  netProceeds: number;
  status: PlatformFeeStatus;
}

export interface OrderDocumentDto {
  id: string;
  orderId: string;
  type: OrderDocumentType;
  status: DocumentStatus;
  documentNumber: string;
  fileName: string;
  generatedAt?: string;
  errorMessage?: string | null;
}

export interface OrdersPageDto {
  totalElements: number;
  totalPages: number;
  size: number;
  content: OrderResponseDto[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface OrdersSummaryPageDto {
  totalElements: number;
  totalPages: number;
  size: number;
  content: OrderSummaryListItemDto[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface GenerateDocumentRequestDto {
  type: OrderDocumentType;
  force?: boolean;
}

export interface UpdateOrderStatusRequestDto {
  orderStatus?: OrderResponseDto['orderStatus'];
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
}

export interface OrderResponseItemDto {
  productId: string;
  sku?: string;
  barcode?: string;
  name?: string;
  mainImage?: {
    id: string;
    url: string;
    publicId?: string;
  };
  volume?: number;
  alcohol?: number;
  producer?: string;
  country?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  priceType?: 'RETAIL' | 'WHOLESALE' | 'DISCOUNT';
  itemSubtotal: number;
  itemTax: number;
  itemWeight?: number;
}

export interface OrderResponseDto {
  id: string;
  orderNumber: string;
  userId: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerCompany?: string;
  sellerId?: string;
  sellerName?: string;
  sellerCompany?: string;
  orderStatus:
    | 'NEW'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'CANCELLED';
  paymentStatus: PaymentStatus;
  paymentMethod: OrderPaymentMethod;
  paymentBatchId?: string;
  orderComment?: string;
  shippingDetails: ShippingDetailsDto;
  billingDetails: BillingDetailsDto;
  summary: OrderSummaryDto;
  items: OrderResponseItemDto[];
  documents: OrderDocumentDto[];
  platformFee?: PlatformFeeInfoDto;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummaryListItemDto {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderStatus: OrderResponseDto['orderStatus'];
  paymentStatus: PaymentStatus;
  summary: OrderSummaryDto;
  buyerCompany?: string;
  buyerName?: string;
  sellerCompany?: string;
  sellerName?: string;
}

export interface postOrder {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  productIds: [];
  companyName: string;
  registration_Number: string;
  liquor_License: string;
  tax_ID: string;
  vat_Number: string;
  bank_Name: string;
  iban: string;
  bic: string;
  telephoneNumber: string;
  role: UserRole;
}
