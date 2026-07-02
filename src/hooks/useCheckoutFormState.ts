import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  checkoutSchema,
  type CheckoutFormData,
  type CheckoutFormSchema,
} from '@/schemas/checkoutSchema';
import type { Address, UserResponse } from '@/types/user';
import type { OrderPaymentMethod } from '@/types/order';
import {
  getAddressKey,
  getFirstEnabledPaymentMethod,
  getPrefilledWarehouseValue,
  getPreferredPaymentMethod,
  getUserFirstName,
  getUserLastName,
  getUserPhone,
  isPaymentMethodEnabled,
  normalizePhone,
} from '@/components/Checkout/checkoutUtils';

const LAST_PAYMENT_METHOD_KEY = 'checkout:last-payment-method';

const useCheckoutFormState = (user?: UserResponse, isSubmitting?: boolean) => {
  const [addressMode, setAddressMode] = useState<'saved' | 'manual' | 'picker'>('manual');
  const [selectedAddressKey, setSelectedAddressKey] = useState('');

  const form = useForm<CheckoutFormSchema, unknown, CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      paymentMethod: getPreferredPaymentMethod(),
      shippingDetails: {
        firstName: '',
        lastName: '',
        phone: '+380',
        city: '',
        deliveryType: 'COURIER',
        warehouseNumber: '',
        addressLine: '',
      },
      orderComment: '',
    },
  });

  const { reset, setValue, watch } = form;
  const selectedDeliveryType = watch('shippingDetails.deliveryType');
  const selectedPaymentMethod = watch('paymentMethod');
  const savedAddresses = user?.shippingAddresses || [];
  const selectedAddress =
    savedAddresses.find((address, index) => getAddressKey(address, index) === selectedAddressKey) ||
    savedAddresses[0];

  useEffect(() => {
    if (!user) return;

    const firstAddress = user.shippingAddresses?.[0];
    const hasSavedAddresses = Boolean(firstAddress);

    setAddressMode(hasSavedAddresses ? 'saved' : 'manual');
    setSelectedAddressKey(firstAddress ? getAddressKey(firstAddress, 0) : '');

    reset((currentValues) => ({
      ...currentValues,
      shippingDetails: {
        ...currentValues.shippingDetails,
        firstName: getUserFirstName(user),
        lastName: getUserLastName(user),
        phone: normalizePhone(getUserPhone(user)),
        city: firstAddress?.city || currentValues.shippingDetails.city,
        addressLine:
          currentValues.shippingDetails.deliveryType === 'COURIER'
            ? firstAddress?.street || currentValues.shippingDetails.addressLine
            : currentValues.shippingDetails.addressLine,
        warehouseNumber:
          currentValues.shippingDetails.deliveryType === 'WAREHOUSE'
            ? getPrefilledWarehouseValue(firstAddress) || currentValues.shippingDetails.warehouseNumber
            : currentValues.shippingDetails.warehouseNumber,
      },
    }));
  }, [reset, user]);

  useEffect(() => {
    if (!isSubmitting) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [isSubmitting]);

  useEffect(() => {
    const selectedMethod = selectedPaymentMethod as OrderPaymentMethod;

    if (!isPaymentMethodEnabled(selectedMethod, user)) {
      setValue('paymentMethod', getFirstEnabledPaymentMethod(user));
      return;
    }

    localStorage.setItem(LAST_PAYMENT_METHOD_KEY, selectedMethod);
  }, [selectedPaymentMethod, setValue, user]);

  useEffect(() => {
    if (selectedDeliveryType === 'COURIER') {
      setValue('shippingDetails.warehouseNumber', '');

      if (addressMode === 'saved' && selectedAddress) {
        setValue('shippingDetails.addressLine', selectedAddress.street || '');
      }
    }

    if (selectedDeliveryType === 'WAREHOUSE') {
      setValue('shippingDetails.addressLine', '');

      if (addressMode === 'saved' && selectedAddress) {
        setValue('shippingDetails.warehouseNumber', getPrefilledWarehouseValue(selectedAddress));
      }
    }
  }, [addressMode, selectedAddress, selectedDeliveryType, setValue]);

  useEffect(() => {
    if (addressMode !== 'saved' || !selectedAddress) return;

    setValue('shippingDetails.city', selectedAddress.city || '');

    if (selectedDeliveryType === 'COURIER') {
      setValue('shippingDetails.addressLine', selectedAddress.street || '');
    }

    if (selectedDeliveryType === 'WAREHOUSE') {
      setValue('shippingDetails.warehouseNumber', getPrefilledWarehouseValue(selectedAddress));
    }
  }, [addressMode, selectedAddress, selectedDeliveryType, setValue]);

  const applySelectedAddress = (address: Address) => {
    setValue('shippingDetails.city', address.city || '');

    if (selectedDeliveryType === 'COURIER') {
      setValue('shippingDetails.addressLine', address.street || '');
    }

    if (selectedDeliveryType === 'WAREHOUSE') {
      setValue('shippingDetails.warehouseNumber', getPrefilledWarehouseValue(address));
    }
  };

  return {
    ...form,
    addressMode,
    savedAddresses,
    selectedAddress,
    selectedAddressKey,
    selectedDeliveryType,
    selectedPaymentMethod,
    setAddressMode,
    setSelectedAddressKey,
    applySelectedAddress,
  };
};

export { useCheckoutFormState };
