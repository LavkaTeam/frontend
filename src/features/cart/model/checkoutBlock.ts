import { isCompanyReadyForCheckout } from '@/components/Checkout/checkoutUtils';
import type { UserResponse } from '@/types/user';

export interface CheckoutBlock {
  title: string;
  text: string;
  action: string;
  to: string;
  primary: boolean;
}

// Checkout is open to verified companies with complete billing details
// (backend: 403 COMPANY_NOT_VERIFIED / COMPANY_VERIFICATION_PENDING), so the
// cart says so instead of sending the user to a checkout they cannot finish.
export const getCheckoutBlock = (user?: UserResponse): CheckoutBlock | null => {
  if (!user || isCompanyReadyForCheckout(user)) return null;

  if (user.verificationStatus === 'PENDING') {
    return {
      title: 'Your company is being reviewed',
      text: 'You can place orders once our team verifies your company. Your cart is kept.',
      action: 'View profile',
      to: '/account?tab=profile',
      primary: false,
    };
  }

  return {
    title:
      user.verificationStatus === 'REJECTED'
        ? 'Company verification rejected'
        : 'Verify your company to order',
    text:
      user.verificationStatus === 'REJECTED'
        ? 'Update the company details in your profile and save them to send them for review again.'
        : 'Orders are available to verified companies. Complete your company profile to send it for review.',
    action: 'Complete company profile',
    // validate=1 highlights every missing field in the profile form.
    to: '/account?tab=profile&validate=1',
    primary: true,
  };
};
