import { Link } from 'react-router-dom';

import type { AccordionItem } from '@/components/ui/Accordion';

export interface FaqGroup {
  id: string;
  title: string;
  items: AccordionItem[];
}

// Answers follow the backend rules (auth, orders, finance and documents).
export const faqGroups: FaqGroup[] = [
  {
    id: 'buyers',
    title: 'For buyers',
    items: [
      {
        id: 'checkout-verification',
        title: 'Why can’t I place an order yet?',
        content: (
          <>
            <p>
              Checkout is open to verified companies only. Fill in your company
              profile and upload the alcohol licence in your account. While the
              review is pending you can browse the catalog and fill your cart;
              checkout opens as soon as the company is verified.
            </p>
          </>
        ),
      },
      {
        id: 'email-link',
        title: 'How long is the email confirmation link valid?',
        content: (
          <p>
            30 minutes. If it has expired, sign in and request a new
            confirmation email.
          </p>
        ),
      },
      {
        id: 'several-sellers',
        title: 'What happens when my cart has products from several sellers?',
        content: (
          <p>
            You pay in one checkout, and the system creates a separate order for
            each seller. Every order has its own status, documents and delivery
            arranged with that seller.
          </p>
        ),
      },
      {
        id: 'payment-methods',
        title: 'Which payment methods are available?',
        content: (
          <>
            <p>The checkout offers four payment methods:</p>
            <ul>
              <li>Invoice</li>
              <li>Cash on delivery</li>
              <li>Online card</li>
              <li>Deferred payment</li>
            </ul>
            <p>
              Online card payment is a demo payment: no real card is charged.
            </p>
          </>
        ),
      },
      {
        id: 'own-products',
        title: 'Can I buy my own products?',
        content: (
          <p>
            No. If you also sell on B2bar, your own products cannot be added to
            the cart. They are marked as yours on the product page.
          </p>
        ),
      },
    ],
  },
  {
    id: 'sellers',
    title: 'For sellers',
    items: [
      {
        id: 'verification-statuses',
        title: 'What do the verification statuses mean?',
        content: (
          <ul>
            <li>
              <strong>Not submitted</strong>: the company profile is not
              complete yet.
            </li>
            <li>
              <strong>In review</strong>: the profile is complete and waits for
              the administrator.
            </li>
            <li>
              <strong>Verified</strong>: you can sell, see finances and request
              payouts.
            </li>
            <li>
              <strong>Rejected</strong>: you receive the reason by email and in
              your profile. Fix the data and the profile goes back to review.
            </li>
          </ul>
        ),
      },
      {
        id: 'payouts',
        title: 'How do payouts work?',
        content: (
          <p>
            Request any amount up to your available balance. The amount is
            reserved at once, and the administrator completes or rejects the
            request. A rejected request comes with a comment and the money
            returns to your balance. See the{' '}
            <Link to='/seller-rules#payouts'>payout rules</Link>.
          </p>
        ),
      },
      {
        id: 'platform-fee',
        title: 'What is the platform fee?',
        content: (
          <p>
            5 percent of the order subtotal: the goods without VAT and delivery.
            For online card orders it is deducted from your balance at payment;
            for other payment methods it is recorded as a fee due when you
            complete the order.
          </p>
        ),
      },
      {
        id: 'product-statuses',
        title: 'Which statuses can a product have?',
        content: (
          <>
            <ul>
              <li>
                <strong>Active</strong>: listed and can be ordered.
              </li>
              <li>
                <strong>Hidden</strong>: kept in your list, not offered to
                buyers.
              </li>
              <li>
                <strong>Under review</strong>: the status of a newly created
                product.
              </li>
              <li>
                <strong>Archived</strong>: no longer sold.
              </li>
            </ul>
            <p>
              A product can be activated only when its stock covers the minimum
              order quantity.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'account',
    title: 'Account and security',
    items: [
      {
        id: 'password-rules',
        title: 'What are the password requirements?',
        content: (
          <p>
            At least 8 characters, with at least one capital letter and one
            digit.
          </p>
        ),
      },
      {
        id: 'password-change',
        title: 'What happens when I change or reset my password?',
        content: (
          <p>
            You are signed out on all other devices. Sign in again there with
            the new password.
          </p>
        ),
      },
      {
        id: 'lockout',
        title: 'Why is my account temporarily locked?',
        content: (
          <p>
            After 5 wrong passwords in a row the account is locked for 15
            minutes. Wait, or reset the password if you have forgotten it.
          </p>
        ),
      },
      {
        id: 'reset-link',
        title: 'How long is the password reset link valid?',
        content: <p>1 hour. After that, request a new link.</p>,
      },
    ],
  },
  {
    id: 'documents',
    title: 'Documents',
    items: [
      {
        id: 'which-documents',
        title: 'Which documents does an order have?',
        content: (
          <ul>
            <li>
              <strong>Purchase order</strong>: created automatically with the
              order.
            </li>
            <li>
              <strong>Proforma invoice</strong> and <strong>invoice</strong>:
              generated by the seller.
            </li>
            <li>
              <strong>Delivery note</strong>: generated when the order gets a
              tracking number.
            </li>
            <li>
              <strong>Settlement statement</strong>: generated by the seller for
              online card orders.
            </li>
          </ul>
        ),
      },
      {
        id: 'who-sees-documents',
        title: 'Who can see the documents?',
        content: (
          <p>
            The buyer and the seller of the order download its documents from
            the order page. The settlement statement is a seller document and is
            not shown to the buyer.
          </p>
        ),
      },
    ],
  },
];
