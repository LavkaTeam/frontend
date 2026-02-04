import { UserRole } from './user';

export type OrderStatus =
  | 'NEW'
  | 'PENDING'
  | 'SHIPPED'
  | 'DELIVERED'
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
