import type { ComponentType } from 'react';
import type { OrderPaymentMethod } from '@/types/order';
import {
  ClockIcon,
  CourierDeliveryIcon,
  CreditCardIcon,
  FileTextIcon,
  PackageCheckIcon,
  WarehouseDeliveryIcon,
} from '@/components/ui/icons/CheckoutIcons';

type CheckoutOptionIconProps = {
  className?: string;
};

type PaymentMethodOption = {
  value: OrderPaymentMethod;
  title: string;
  description: string;
  disabledReason?: string;
  icon: ComponentType<CheckoutOptionIconProps>;
};

type DeliveryTypeOption = {
  value: 'COURIER' | 'WAREHOUSE';
  title: string;
  description: string;
  icon: ComponentType<CheckoutOptionIconProps>;
};

const paymentMethodOptions: PaymentMethodOption[] = [
  {
    value: 'INVOICE',
    title: 'Invoice payment',
    description: 'Bank transfer for company purchases.',
    disabledReason: 'Complete company profile first',
    icon: FileTextIcon,
  },
  {
    value: 'CASH_ON_DELIVERY',
    title: 'Cash on delivery',
    description: 'Pay when receiving the shipment.',
    disabledReason: 'Complete company profile first',
    icon: PackageCheckIcon,
  },
  {
    value: 'CARD_ONLINE',
    title: 'Online card payment',
    description: 'Secure online payment for verified company accounts.',
    disabledReason: 'Complete company profile first',
    icon: CreditCardIcon,
  },
  {
    value: 'DEFERRED_PAYMENT',
    title: 'Deferred payment',
    description: 'Flexible post-payment terms for verified buyers.',
    disabledReason: 'Complete company profile first',
    icon: ClockIcon,
  },
];

const deliveryTypeOptions: DeliveryTypeOption[] = [
  {
    value: 'COURIER',
    title: 'Courier',
    description: 'Door-to-door delivery to your company address.',
    icon: CourierDeliveryIcon,
  },
  {
    value: 'WAREHOUSE',
    title: 'Warehouse',
    description: 'Pickup from a warehouse or postal branch.',
    icon: WarehouseDeliveryIcon,
  },
];

const paymentMethodValues: OrderPaymentMethod[] = [
  'INVOICE',
  'CASH_ON_DELIVERY',
  'CARD_ONLINE',
  'DEFERRED_PAYMENT',
];

export { deliveryTypeOptions, paymentMethodOptions, paymentMethodValues };
export type { DeliveryTypeOption, PaymentMethodOption };
