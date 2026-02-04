import type { Order } from '@/types/order';
import { productData } from './productData';

// Допоміжна функція, щоб не копіювати поля товару вручну 50 разів
const createOrderItem = (productId: string, quantity: number) => {
  const product = productData.find((p) => p.id === productId);

  // Якщо товару з таким ID немає в базі - повертаємо заглушку (щоб не ламало верстку)
  if (!product) {
    return {
      productId: '0',
      productName: 'Unknown Product',
      productPrice: 0,
      productQuantity: quantity,
      productVolume: '0 L',
      productProducer: 'Unknown',
      productPackaging: 'Unknown',
      productImage: '',
    };
  }

  return {
    productId: product.id,
    productName: product.title,
    productPrice: product.price,
    productQuantity: quantity,
    productVolume: product.capacity + ' L',
    productProducer: `${product.country} / ${product.brand}`,
    productPackaging: 'Glass',
    productImage: product.image,
  };
};

export const mockOrders: Order[] = [
  // 1. New Order
  {
    orderId: '2054891',
    userId: 'user123',
    orderStatus: 'NEW',
    orderTotalPrice: 120.5,
    orderCreatedAt: '2025-05-11T10:00:00.000Z',
    orderUpdatedAt: '2025-05-11T10:00:00.000Z',
    deliveryAddress: 'Flat 9, 16 Queen’s Gate Boulevard, London, SW7 5JA',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Online',
    orderItems: [
      createOrderItem('1', 2), // Nordic Gin
      createOrderItem('3', 1), // Baltic Vodka
      createOrderItem('6', 1), // Highland Scotch
    ],
  },

  // 2. Shipped Order
  {
    orderId: '2054892',
    userId: 'user123',
    orderStatus: 'SHIPPED',
    orderTotalPrice: 79.0,
    orderCreatedAt: '2025-05-10T14:30:00.000Z',
    orderUpdatedAt: '2025-05-10T15:00:00.000Z',
    deliveryAddress: 'Kyiv, Khreshchatyk 1, apt 12',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Card',
    orderItems: [
      createOrderItem('2', 2), // Irish Whiskey
    ],
  },

  // 3. Delivered Order
  {
    orderId: '2054893',
    userId: 'user123',
    orderStatus: 'DELIVERED',
    orderTotalPrice: 54.8,
    orderCreatedAt: '2025-05-08T09:15:00.000Z',
    orderUpdatedAt: '2025-05-09T12:00:00.000Z',
    deliveryAddress: 'Lviv, Rynok Square 1',
    deliveryType: 'Pickup',
    paymentMethod: 'Online',
    orderItems: [
      createOrderItem('4', 2), // Caribbean Rum
    ],
  },

  // 4. Cancelled Order
  {
    orderId: '2054894',
    userId: 'user123',
    orderStatus: 'CANCELLED',
    orderTotalPrice: 21.0,
    orderCreatedAt: '2025-05-05T18:45:00.000Z',
    orderUpdatedAt: '2025-05-06T09:00:00.000Z',
    deliveryAddress: 'Odesa, Deribasivska 10',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Online',
    orderItems: [
      createOrderItem('5', 1), // Polar Ice Vodka
    ],
  },

  // 5. Pending Order
  {
    orderId: '2054895',
    userId: 'user123',
    orderStatus: 'PENDING',
    orderTotalPrice: 88.4,
    orderCreatedAt: '2025-05-04T11:20:00.000Z',
    orderUpdatedAt: '2025-05-04T11:20:00.000Z',
    deliveryAddress: 'Kyiv, Mechnikova 2',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Card',
    orderItems: [
      createOrderItem('6', 2), // Highland Scotch
    ],
  },

  // 6. Delivered
  {
    orderId: '2054896',
    userId: 'user123',
    orderStatus: 'DELIVERED',
    orderTotalPrice: 19.3,
    orderCreatedAt: '2025-05-01T10:00:00.000Z',
    orderUpdatedAt: '2025-05-02T16:00:00.000Z',
    deliveryAddress: 'Warsaw, Zlota 44',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Online',
    orderItems: [
      createOrderItem('7', 1), // Crystal Clear Vodka
    ],
  },

  // 7. Delivered
  {
    orderId: '2054897',
    userId: 'user123',
    orderStatus: 'DELIVERED',
    orderTotalPrice: 59.98,
    orderCreatedAt: '2025-04-28T13:45:00.000Z',
    orderUpdatedAt: '2025-04-29T10:30:00.000Z',
    deliveryAddress: 'London, Baker Street 221B',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Card',
    orderItems: [
      createOrderItem('8', 2), // Golden Caribbean Rum
    ],
  },

  // 8. Cancelled
  {
    orderId: '2054898',
    userId: 'user123',
    orderStatus: 'CANCELLED',
    orderTotalPrice: 63.0,
    orderCreatedAt: '2025-04-25T15:00:00.000Z',
    orderUpdatedAt: '2025-04-25T16:00:00.000Z',
    deliveryAddress: 'Kyiv, Podil 5',
    deliveryType: 'Pickup',
    paymentMethod: 'Cash',
    orderItems: [
      createOrderItem('9', 2), // Silver Mountain Gin
    ],
  },

  // 9. Delivered
  {
    orderId: '2054899',
    userId: 'user123',
    orderStatus: 'DELIVERED',
    orderTotalPrice: 126.0,
    orderCreatedAt: '2025-04-20T09:00:00.000Z',
    orderUpdatedAt: '2025-04-22T14:00:00.000Z',
    deliveryAddress: 'Lviv, Bandery 12',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Online',
    orderItems: [
      createOrderItem('10', 3), // Old Barrel Whiskey
    ],
  },

  // 10. Shipped
  {
    orderId: '2054900',
    userId: 'user123',
    orderStatus: 'SHIPPED',
    orderTotalPrice: 45.8,
    orderCreatedAt: '2025-04-18T17:30:00.000Z',
    orderUpdatedAt: '2025-04-19T09:00:00.000Z',
    deliveryAddress: 'Dnipro, Yavornytskoho 55',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Online',
    orderItems: [
      createOrderItem('11', 2), // Clear Stream Vodka
    ],
  },

  // 11. Delivered
  {
    orderId: '2054901',
    userId: 'user123',
    orderStatus: 'DELIVERED',
    orderTotalPrice: 28.75,
    orderCreatedAt: '2025-04-15T12:00:00.000Z',
    orderUpdatedAt: '2025-04-16T18:00:00.000Z',
    deliveryAddress: 'Kyiv, Lesi Ukrainky 24',
    deliveryType: 'Pickup',
    paymentMethod: 'Cash',
    orderItems: [
      createOrderItem('12', 1), // Tropical Breeze Rum
    ],
  },

  // 12. Pending
  {
    orderId: '2054902',
    userId: 'user123',
    orderStatus: 'PENDING',
    orderTotalPrice: 155.94,
    orderCreatedAt: '2025-04-10T08:00:00.000Z',
    orderUpdatedAt: '2025-04-10T08:00:00.000Z',
    deliveryAddress: 'Kharkiv, Sumska 10',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Online',
    orderItems: [
      createOrderItem('1', 6), // Nordic Gin (Party pack!)
    ],
  },

  // 13. Delivered
  {
    orderId: '2054903',
    userId: 'user123',
    orderStatus: 'DELIVERED',
    orderTotalPrice: 79.0,
    orderCreatedAt: '2025-04-05T19:20:00.000Z',
    orderUpdatedAt: '2025-04-07T11:00:00.000Z',
    deliveryAddress: 'Kyiv, Saksahanskoho 30',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Card',
    orderItems: [
      createOrderItem('2', 2), // Irish Whiskey
    ],
  },

  // 14. Cancelled
  {
    orderId: '2054904',
    userId: 'user123',
    orderStatus: 'CANCELLED',
    orderTotalPrice: 56.25,
    orderCreatedAt: '2025-04-01T14:10:00.000Z',
    orderUpdatedAt: '2025-04-01T15:00:00.000Z',
    deliveryAddress: 'Odesa, French Blvd 15',
    deliveryType: 'Pickup',
    paymentMethod: 'Online',
    orderItems: [
      createOrderItem('3', 3), // Baltic Vodka
    ],
  },

  // 15. Delivered (Oldest)
  {
    orderId: '2054905',
    userId: 'user123',
    orderStatus: 'DELIVERED',
    orderTotalPrice: 137.0,
    orderCreatedAt: '2025-03-25T10:00:00.000Z',
    orderUpdatedAt: '2025-03-26T13:00:00.000Z',
    deliveryAddress: 'Lviv, Horodotska 50',
    deliveryType: 'Courier delivery',
    paymentMethod: 'Online',
    orderItems: [
      createOrderItem('4', 5), // Caribbean Rum
    ],
  },
];
