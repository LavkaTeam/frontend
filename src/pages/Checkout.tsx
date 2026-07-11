import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckoutCompanyCard } from '@/components/Checkout/CheckoutCompanyCard';
import { CheckoutDeliveryCard } from '@/components/Checkout/CheckoutDeliveryCard';
import { CheckoutOrderSummary } from '@/components/Checkout/CheckoutOrderSummary';
import { CheckoutPaymentCard } from '@/components/Checkout/CheckoutPaymentCard';
import { CheckoutSkeleton } from '@/components/Checkout/CheckoutSkeleton';
import { Button } from '@/components/ui/Button';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Loader } from '@/components/ui/Loader';
import { EmptyCartIcon } from '@/components/ui/icons/EmptyCartIcon';
import { useGetCart } from '@/hooks/useCartQueries';
import { useCheckoutFormState } from '@/hooks/useCheckoutFormState';
import { useCheckoutOrder } from '@/hooks/useCheckoutOrder';
import { useCreateDemoPaymentSession } from '@/hooks/usePayments';
import { useToast } from '@/hooks/useToast';
import { useUser } from '@/hooks/useUser';
import {
  checkoutSchema,
  type CheckoutFormData,
} from '@/schemas/checkoutSchema';
import type { UserResponse } from '@/types/user';
import { extractErrorMessage } from '@/utils/error';
import { buildSellerGroups } from '@/features/checkout/model/sellerGroups';
import {
  saveCheckoutSuccessOrders,
  savePaymentBatchContext,
} from '@/utils/checkoutSuccessStorage';
import {
  formatAddressLine,
  getBankName,
  getMissingBillingFields,
  getRegistrationNumber,
  getTaxId,
  getUserFirstName,
  getUserLastName,
  getVerificationMeta,
  isCompanyReadyForCheckout,
  isCompanyVerified,
} from '@/components/Checkout/checkoutUtils';

import styles from './Checkout.module.css';

const Checkout = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { data: cart, isLoading: isCartLoading } = useGetCart(true);
  const { data: user, isLoading: isUserLoading } = useUser();
  const checkoutOrder = useCheckoutOrder();
  const createDemoSessionMutation = useCreateDemoPaymentSession();
  const companyCardRef = useRef<HTMLDivElement | null>(null);
  const deliveryCardRef = useRef<HTMLDivElement | null>(null);
  const paymentCardRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    getValues,
    formState: { errors },
    addressMode,
    savedAddresses,
    selectedAddress,
    selectedAddressKey,
    selectedDeliveryType,
    selectedPaymentMethod,
    setAddressMode,
    setSelectedAddressKey,
    applySelectedAddress,
  } = useCheckoutFormState(user, checkoutOrder.isPending);

  const recipientFirstName = watch('shippingDetails.firstName');
  const recipientLastName = watch('shippingDetails.lastName');
  const recipientPhone = watch('shippingDetails.phone');
  const liveFormValues = watch();
  const legalAddress = formatAddressLine(user?.legalAddress);
  const canShowSavedAddresses = savedAddresses.length > 0;
  const companyVerified = isCompanyVerified(user);
  const companyReadyForCheckout = isCompanyReadyForCheckout(user);
  const missingBillingFields = getMissingBillingFields(user);
  const companyRequirements = [
    ...(missingBillingFields.length > 0
      ? [`Missing: ${missingBillingFields.join(', ')}`]
      : []),
    ...(!companyVerified ? ['Company verification is required'] : []),
  ];
  const paymentWarning = !companyReadyForCheckout
    ? 'Complete company details and verification to unlock payment methods.'
    : undefined;
  const managerName = `${getUserFirstName(user || ({} as UserResponse))} ${getUserLastName(
    user || ({} as UserResponse),
  )}`.trim();
  const managerPhone =
    user?.phoneNumber || user?.telephoneNumber || 'Not specified';
  const deliveryContactName =
    `${recipientFirstName || ''} ${recipientLastName || ''}`.trim();
  const isFormReady = checkoutSchema.safeParse(liveFormValues).success;
  const canPlaceOrder = companyReadyForCheckout && isFormReady;
  const companyStatusMeta = getVerificationMeta(user?.verificationStatus);
  const companyStatus = {
    ...companyStatusMeta,
    toneClassName:
      companyStatusMeta.tone === 'verified'
        ? styles.companyStatusVerified
        : companyStatusMeta.tone === 'pending'
          ? styles.companyStatusPending
          : companyStatusMeta.tone === 'rejected'
            ? styles.companyStatusRejected
            : styles.companyStatusDefault,
  };

  const deliveryAddressSummary = selectedAddress
    ? {
        title: selectedAddress.title || selectedAddress.city || 'Saved address',
        location: formatAddressLine(selectedAddress),
        recipient: selectedAddress.recipientName || deliveryContactName,
        phone: selectedAddress.recipientPhone || recipientPhone,
      }
    : null;

  const scrollToCard = (card: HTMLDivElement | null) => {
    card?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollToFirstInvalidCard = () => {
    if (!companyReadyForCheckout) {
      scrollToCard(companyCardRef.current);
      return;
    }

    const validation = checkoutSchema.safeParse(getValues());

    if (!validation.success) {
      const hasDeliveryErrors = validation.error.issues.some(
        (issue) => issue.path[0] === 'shippingDetails',
      );
      const hasPaymentErrors = validation.error.issues.some(
        (issue) =>
          issue.path[0] === 'paymentMethod' || issue.path[0] === 'orderComment',
      );

      if (hasDeliveryErrors) {
        scrollToCard(deliveryCardRef.current);
        return;
      }

      if (hasPaymentErrors) {
        scrollToCard(paymentCardRef.current);
      }
    }
  };

  if (isCartLoading || isUserLoading) {
    return <CheckoutSkeleton />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className={`container ${styles.checkout}`}>
        <div className={styles.header}>
          <HeadingH3>Checkout</HeadingH3>
        </div>

        <section className={styles.emptyState}>
          <div className={styles.emptyStateCard}>
            <div className={styles.emptyStateIcon}>
              <EmptyCartIcon />
            </div>
            <div className={styles.emptyStateContent}>
              <p className={styles.emptyStateEyebrow}>Nothing to place yet</p>
              <h4 className={styles.emptyStateTitle}>Your cart is empty</h4>
              <p className={styles.emptyStateText}>
                Add products to the cart to continue with checkout.
              </p>
            </div>
            <div className={styles.emptyStateActions}>
              <Link to='/cart'>
                <Button>Return to cart</Button>
              </Link>
              <Link to='/products'>
                <Button variant='secondary'>Continue shopping</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const sellerGroups = buildSellerGroups(cart.items);

  const hasMultipleSellers = sellerGroups.length > 1;

  const onSubmit = async (data: CheckoutFormData) => {
    if (!companyReadyForCheckout) {
      scrollToCard(companyCardRef.current);
      return;
    }

    try {
      const orders = await checkoutOrder.mutateAsync({
        paymentMethod: data.paymentMethod,
        orderComment: data.orderComment?.trim() || undefined,
        shippingDetails: {
          ...data.shippingDetails,
          warehouseNumber:
            data.shippingDetails.deliveryType === 'WAREHOUSE'
              ? data.shippingDetails.warehouseNumber?.trim() || undefined
              : undefined,
          addressLine:
            data.shippingDetails.deliveryType === 'COURIER'
              ? data.shippingDetails.addressLine?.trim() || undefined
              : undefined,
        },
      });

      if (data.paymentMethod === 'CARD_ONLINE') {
        const paymentBatchId = orders.find((order) => order.paymentBatchId)
          ?.paymentBatchId;

        if (!paymentBatchId) {
          throw new Error('Unable to start online payment for this order.');
        }

        savePaymentBatchContext({
          batchId: paymentBatchId,
          paymentMethod: 'CARD_ONLINE',
          paymentStatus: 'AWAITING_PAYMENT',
          totalAmount: orders.reduce(
            (sum, order) => sum + (order.summary.grandTotal || 0),
            0,
          ),
          currency: 'USD',
          orderIds: orders.map((order) => order.id),
          orderNumbers: orders.map((order) => order.orderNumber),
        });

        const session =
          await createDemoSessionMutation.mutateAsync(paymentBatchId);

        window.location.assign(session.checkoutUrl);
        return;
      }

      saveCheckoutSuccessOrders(orders);
      navigate('/payment/success?source=checkout');
    } catch (error) {
      const status =
        error && typeof error === 'object' && 'status' in error
          ? Number((error as { status?: unknown }).status)
          : undefined;
      const message =
        status === 404 && data.paymentMethod === 'CARD_ONLINE'
          ? 'Online payment is currently unavailable. Please choose another payment method.'
          : extractErrorMessage(error, 'Failed to create order.');

      showToast(message, 'error');
    }
  };

  const handlePlaceOrderClick = async () => {
    if (checkoutOrder.isPending || createDemoSessionMutation.isPending) return;

    const isValid = await trigger();

    if (!companyReadyForCheckout || !isValid) {
      scrollToFirstInvalidCard();
      return;
    }

    await handleSubmit(onSubmit)();
  };

  return (
    <main className={`container ${styles.checkout}`}>
      {checkoutOrder.isPending || createDemoSessionMutation.isPending ? (
        <Loader variant='fullscreen' className={styles.pageLoaderOverlay} />
      ) : null}

      <>
        <div className={styles.header}>
          <HeadingH3>Checkout</HeadingH3>
        </div>

        <form
          className={styles.layout}
          onSubmit={handleSubmit(onSubmit, scrollToFirstInvalidCard)}
          noValidate
        >
          <section className={styles.formColumn}>
            <CheckoutCompanyCard
              ref={companyCardRef}
              companyName={user?.companyName}
              companyStatus={companyStatus}
              legalAddress={legalAddress}
              managerName={managerName}
              managerPhone={managerPhone}
              email={user?.email}
              registrationNumber={getRegistrationNumber(user)}
              taxId={getTaxId(user)}
              iban={(user?.iban || '').toUpperCase()}
              bankName={getBankName(user)}
              companyRequirements={companyRequirements}
            />

            <CheckoutDeliveryCard
              ref={deliveryCardRef}
              register={register}
              control={control}
              errors={errors}
              selectedDeliveryType={selectedDeliveryType}
              addressMode={addressMode}
              setAddressMode={setAddressMode}
              selectedAddressKey={selectedAddressKey}
              setSelectedAddressKey={setSelectedAddressKey}
              setValue={setValue}
              canShowSavedAddresses={canShowSavedAddresses}
              savedAddresses={savedAddresses}
              selectedAddress={selectedAddress}
              deliveryAddressSummary={deliveryAddressSummary}
              deliveryContactName={deliveryContactName}
              recipientPhone={recipientPhone}
              user={user}
              applySelectedAddress={applySelectedAddress}
            />

            <CheckoutPaymentCard
              ref={paymentCardRef}
              register={register}
              errors={errors}
              selectedPaymentMethod={selectedPaymentMethod}
              paymentWarning={paymentWarning}
              user={user}
            />
          </section>

          <CheckoutOrderSummary
            sellerGroups={sellerGroups}
            hasMultipleSellers={hasMultipleSellers}
            cartSummary={cart.summary}
            canPlaceOrder={canPlaceOrder}
            isSubmitting={
              checkoutOrder.isPending || createDemoSessionMutation.isPending
            }
            onPlaceOrder={handlePlaceOrderClick}
          />
        </form>
      </>
    </main>
  );
};

export default Checkout;
