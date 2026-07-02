import { forwardRef } from 'react';
import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from 'react-hook-form';
import { InputField } from '@/components/Form';
import { SubHeading } from '@/components/ui/SubHeading';
import type { Address, UserResponse } from '@/types/user';
import type { CheckoutFormData, CheckoutFormSchema } from '@/schemas/checkoutSchema';
import { CheckoutOptionCard } from './CheckoutOptionCard';
import { deliveryTypeOptions } from './checkoutOptions';
import { formatAddressLabel, getAddressKey, getUserFirstName, getUserLastName, getUserPhone, normalizePhone } from './checkoutUtils';
import styles from '@/pages/Checkout.module.css';

type CheckoutDeliveryCardProps = {
  register: UseFormRegister<CheckoutFormSchema>;
  control: Control<CheckoutFormSchema, unknown, CheckoutFormData>;
  errors: FieldErrors<CheckoutFormSchema>;
  selectedDeliveryType: CheckoutFormSchema['shippingDetails']['deliveryType'];
  addressMode: 'saved' | 'manual' | 'picker';
  setAddressMode: (mode: 'saved' | 'manual' | 'picker') => void;
  selectedAddressKey: string;
  setSelectedAddressKey: (key: string) => void;
  setValue: UseFormSetValue<CheckoutFormSchema>;
  canShowSavedAddresses: boolean;
  savedAddresses: Address[];
  selectedAddress?: Address;
  deliveryAddressSummary: {
    title: string;
    location: string;
    recipient: string;
    phone: string;
  } | null;
  deliveryContactName: string;
  recipientPhone: string;
  user?: UserResponse;
  applySelectedAddress: (address: Address) => void;
};

const CheckoutDeliveryCard = forwardRef<HTMLDivElement, CheckoutDeliveryCardProps>(
  (
    {
      register,
      control,
      errors,
      selectedDeliveryType,
      addressMode,
      setAddressMode,
      selectedAddressKey,
      setSelectedAddressKey,
      setValue,
      canShowSavedAddresses,
      savedAddresses,
      deliveryAddressSummary,
      deliveryContactName,
      recipientPhone,
      user,
      applySelectedAddress,
    },
    ref,
  ) => (
    <div ref={ref} className={styles.card}>
      <SubHeading color='secondary'>Delivery details</SubHeading>
      <div className={styles.groupBlock}>
        <span className={styles.groupLabel}>Delivery type</span>
        <div className={styles.optionList}>
          {deliveryTypeOptions.map((option) => (
            <CheckoutOptionCard
              key={option.value}
              title={option.title}
              description={option.description}
              icon={option.icon}
              selected={selectedDeliveryType === option.value}
              inputProps={register('shippingDetails.deliveryType')}
              kind='delivery'
              value={option.value}
            />
          ))}
        </div>
        {errors.shippingDetails?.deliveryType ? (
          <p className={styles.error}>{errors.shippingDetails.deliveryType.message}</p>
        ) : null}
      </div>

      <div className={styles.recipientCard}>
        <div className={styles.recipientHeader}>
          <div>
            <p className={styles.recipientEyebrow}>Recipient contact</p>
            <p className={styles.recipientName}>{deliveryContactName || 'Contact details missing'}</p>
            <p className={styles.recipientPhone}>{recipientPhone || '+380'}</p>
          </div>
        </div>

        <div className={styles.sectionGroup}>
          <div className={styles.grid}>
            <InputField
              id='shipping-firstName'
              label='First name'
              placeholder='John'
              error={errors.shippingDetails?.firstName?.message}
              {...register('shippingDetails.firstName')}
            />
            <InputField
              id='shipping-lastName'
              label='Last name'
              placeholder='Smith'
              error={errors.shippingDetails?.lastName?.message}
              {...register('shippingDetails.lastName')}
            />
          </div>

          <Controller
            control={control}
            name='shippingDetails.phone'
            render={({ field }) => (
              <InputField
                id='shipping-phone'
                label='Phone'
                placeholder='+380XXXXXXXXX'
                value={field.value}
                error={errors.shippingDetails?.phone?.message}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(normalizePhone(event.target.value))}
              />
            )}
          />
        </div>
      </div>

      {canShowSavedAddresses && addressMode !== 'manual' ? (
        <div className={styles.sectionGroup}>
          <div className={styles.savedAddressHeader}>
            <span className={styles.groupLabel}>
              {addressMode === 'picker' ? 'Saved addresses' : 'Delivery address'}
            </span>
            <div className={styles.addressActions}>
              {addressMode === 'saved' ? (
                <>
                  <button type='button' className={styles.textButton} onClick={() => setAddressMode('picker')}>
                    Change
                  </button>
                  <button
                    type='button'
                    className={styles.textButton}
                    onClick={() => {
                      setAddressMode('manual');
                      setSelectedAddressKey('');
                      setValue('shippingDetails.city', '');
                      setValue('shippingDetails.addressLine', '');
                      setValue('shippingDetails.warehouseNumber', '');
                    }}
                  >
                    Add new
                  </button>
                </>
              ) : (
                <button type='button' className={styles.textButton} onClick={() => setAddressMode('saved')}>
                  Back
                </button>
              )}
            </div>
          </div>

          {addressMode === 'picker' ? (
            <div className={styles.addressList}>
              {savedAddresses.map((address, index) => {
                const addressKey = getAddressKey(address, index);
                const label = formatAddressLabel(address);

                return (
                  <button
                    key={addressKey}
                    type='button'
                    className={`${styles.addressCard} ${selectedAddressKey === addressKey ? styles.addressCardActive : ''}`}
                    onClick={() => {
                      setAddressMode('saved');
                      setSelectedAddressKey(addressKey);
                      applySelectedAddress(address);
                    }}
                  >
                    <div>
                      <p className={styles.addressTitle}>{label.heading}</p>
                      <p className={styles.addressDescription}>{label.details || 'Address details missing'}</p>
                      <div className={styles.addressMeta}>
                        <span>
                          Recipient:{' '}
                          {address.recipientName ||
                            `${getUserFirstName(user || ({} as UserResponse))} ${getUserLastName(
                              user || ({} as UserResponse),
                            )}`.trim()}
                        </span>
                        <span>
                          Phone: {address.recipientPhone || getUserPhone(user || ({} as UserResponse))}
                        </span>
                      </div>
                    </div>
                    <span className={styles.optionIndicator} aria-hidden='true' />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={styles.selectedAddressCard}>
              <div>
                <p className={styles.addressTitle}>{deliveryAddressSummary?.title || 'Saved address'}</p>
                <p className={styles.addressDescription}>
                  {deliveryAddressSummary?.location || 'Address details missing'}
                </p>
                <div className={styles.addressMeta}>
                  <span>Recipient: {deliveryAddressSummary?.recipient}</span>
                  <span>Phone: {deliveryAddressSummary?.phone}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {!canShowSavedAddresses || addressMode === 'manual' ? (
        <>
          {canShowSavedAddresses ? (
            <p className={styles.helperText}>
              Enter a one-time delivery address for this order. This will not change your company billing profile.
            </p>
          ) : null}

          <div className={styles.sectionGroup}>
            <InputField
              id='shipping-city'
              label='City'
              placeholder='New York'
              error={errors.shippingDetails?.city?.message}
              {...register('shippingDetails.city')}
            />

            {selectedDeliveryType === 'WAREHOUSE' ? (
              <InputField
                id='shipping-warehouse'
                label='Warehouse number'
                placeholder='A17'
                error={errors.shippingDetails?.warehouseNumber?.message}
                {...register('shippingDetails.warehouseNumber')}
              />
            ) : null}

            {selectedDeliveryType === 'COURIER' ? (
              <InputField
                id='shipping-address'
                label='Street address'
                placeholder='123 Madison Ave, Suite 400'
                error={errors.shippingDetails?.addressLine?.message}
                {...register('shippingDetails.addressLine')}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  ),
);

CheckoutDeliveryCard.displayName = 'CheckoutDeliveryCard';

export { CheckoutDeliveryCard };
