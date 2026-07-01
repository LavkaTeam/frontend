import type { CartItemDto } from '@/types/cart';
import type { OrderPaymentMethod } from '@/types/order';
import type { Address, UserResponse } from '@/types/user';
import { paymentMethodOptions, paymentMethodValues } from './checkoutOptions';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatWeight = (value: number) =>
  Number.isFinite(value) ? `${value.toFixed(1)} kg` : '0.0 kg';

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const localDigits = digits.startsWith('380') ? digits.slice(3) : digits;

  return `+380${localDigits.slice(0, 9)}`;
};

const getPreferredPaymentMethod = (): OrderPaymentMethod => {
  const storedValue = localStorage.getItem('checkout:last-payment-method');

  return paymentMethodValues.includes(storedValue as OrderPaymentMethod)
    ? (storedValue as OrderPaymentMethod)
    : 'INVOICE';
};

const getUserFirstName = (user: UserResponse) => user.firstName || user.name || '';
const getUserLastName = (user: UserResponse) => user.lastName || '';
const getUserPhone = (user: UserResponse) => user.phoneNumber || user.telephoneNumber || '+380';
const getRegistrationNumber = (user?: UserResponse) => user?.registrationNumber || user?.registration_Number || '';
const getTaxId = (user?: UserResponse) => user?.taxId || user?.tax_ID || '';
const getBankName = (user?: UserResponse) => user?.bankName || user?.bank_Name || '';

const getMissingBillingFields = (user?: UserResponse) => {
  const missingFields: string[] = [];

  if (!getRegistrationNumber(user)) missingFields.push('Registration number');
  if (!getTaxId(user)) missingFields.push('Tax ID');
  if (!user?.iban) missingFields.push('IBAN');
  if (!getBankName(user)) missingFields.push('Bank');
  if (!user?.legalAddress) missingFields.push('Legal address');

  return missingFields;
};

const isBillingComplete = (user?: UserResponse) =>
  Boolean(
    user?.companyName &&
      getRegistrationNumber(user) &&
      getTaxId(user) &&
      user?.iban &&
      getBankName(user) &&
      user?.legalAddress,
  );

const isCompanyVerified = (user?: UserResponse) => user?.verificationStatus === 'VERIFIED';
const isCompanyReadyForCheckout = (user?: UserResponse) => isBillingComplete(user) && isCompanyVerified(user);

const isPaymentMethodEnabled = (method: OrderPaymentMethod, user?: UserResponse) =>
  paymentMethodValues.includes(method) && isCompanyReadyForCheckout(user);

const getPaymentMethodDisabledReason = (
  method: OrderPaymentMethod,
  user?: UserResponse,
) => {
  const option = paymentMethodOptions.find((item) => item.value === method);

  if (!paymentMethodValues.includes(method)) return option?.disabledReason;
  if (!isBillingComplete(user) && !isCompanyVerified(user)) return 'Complete company details and verification first';
  if (!isBillingComplete(user)) return 'Complete company details first';
  if (!isCompanyVerified(user)) return 'Complete company verification first';

  return undefined;
};

const getFirstEnabledPaymentMethod = (user?: UserResponse) =>
  (paymentMethodValues.find((method) => isPaymentMethodEnabled(method, user)) || 'INVOICE') as OrderPaymentMethod;

const getAddressKey = (address: Address, index: number) =>
  address.id || `${address.city || 'city'}-${address.street || 'street'}-${index}`;

const formatAddressLine = (address?: Address) => {
  if (!address) return '';

  return [address.country, address.city, address.street, address.zipCode]
    .filter(Boolean)
    .join(', ');
};

const formatAddressLabel = (address: Address) => ({
  heading: address.title || address.city || address.street || 'Saved address',
  details: [address.street, address.zipCode].filter(Boolean).join(', '),
});

const getPrefilledWarehouseValue = (address?: Address) =>
  address?.title || address?.street || '';

const getVerificationMeta = (status?: UserResponse['verificationStatus']) => {
  switch (status) {
    case 'VERIFIED':
      return { label: 'Verified seller', tone: 'verified' as const, showIcon: true };
    case 'PENDING':
      return { label: 'Pending verification', tone: 'pending' as const, showIcon: false };
    case 'REJECTED':
      return { label: 'Rejected', tone: 'rejected' as const, showIcon: false };
    default:
      return { label: 'Not verified', tone: 'default' as const, showIcon: false };
  }
};

const getItemSubtotal = (item: CartItemDto) => {
  if (typeof item.itemSubtotal === 'number') return item.itemSubtotal;
  if (typeof item.appliedPrice === 'number') return item.appliedPrice * item.requestedQuantity;

  return item.totalPrice || 0;
};

const getItemTax = (item: CartItemDto) => {
  if (typeof item.itemTax === 'number') return item.itemTax;

  const rawTaxRate = item.taxRate ?? 0;
  const taxRate = rawTaxRate > 1 ? rawTaxRate / 100 : rawTaxRate;

  return getItemSubtotal(item) * taxRate;
};

const getItemTotal = (item: CartItemDto) => getItemSubtotal(item) + getItemTax(item);

const getItemUnitPrice = (item: CartItemDto) =>
  item.requestedQuantity > 0 ? getItemTotal(item) / item.requestedQuantity : 0;

export {
  formatAddressLabel,
  formatAddressLine,
  formatCurrency,
  formatWeight,
  getAddressKey,
  getBankName,
  getFirstEnabledPaymentMethod,
  getItemSubtotal,
  getItemTax,
  getItemTotal,
  getItemUnitPrice,
  getMissingBillingFields,
  getPaymentMethodDisabledReason,
  getPrefilledWarehouseValue,
  getPreferredPaymentMethod,
  getRegistrationNumber,
  getTaxId,
  getUserFirstName,
  getUserLastName,
  getUserPhone,
  getVerificationMeta,
  isBillingComplete,
  isCompanyReadyForCheckout,
  isCompanyVerified,
  isPaymentMethodEnabled,
  normalizePhone,
};
