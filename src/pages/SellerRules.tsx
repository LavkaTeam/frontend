import { Link } from 'react-router-dom';

import {
  StaticNote,
  StaticPage,
  StaticSection,
  StatusList,
} from '@/components/StaticPage';

const SellerRules = () => (
  <StaticPage
    title='Rules for Sellers'
    eyebrow='For sellers'
    description='Rules for sellers on B2bar: verification, product statuses, wholesale prices, orders, platform fee, payouts and documents.'
    intro={
      <p>
        How products, orders, fees and payouts work for sellers. New to B2bar?
        Start with <Link to='/become-a-seller'>How to Become a Seller</Link>.
      </p>
    }
  >
    <StaticSection id='verification' title='Verification'>
      <p>
        A verified company is required to create or edit products and to see
        finances and payouts. Until then the seller account shows what is
        missing.
      </p>
    </StaticSection>

    <StaticSection id='products' title='Products'>
      <StatusList
        items={[
          {
            name: 'Active',
            code: 'ACTIVE',
            text: 'Listed for buyers and can be added to a cart.',
          },
          {
            name: 'Hidden',
            code: 'HIDDEN',
            text: 'Kept in your list but not offered to buyers.',
          },
          {
            name: 'Under review',
            code: 'UNDER_REVIEW',
            text: 'The status of a newly created product.',
          },
          {
            name: 'Archived',
            code: 'ARCHIVED',
            text: 'No longer sold.',
          },
        ]}
      />
      <ul>
        <li>
          A product can be activated only when its stock is at least the minimum
          order quantity.
        </li>
        <li>
          <strong>Wholesale tiers:</strong> the tier with the highest minimum
          quantity that is not above the quantity in the cart applies. A
          promotional price overrides the tiers.
        </li>
        <li>Product images: JPG, PNG or WEBP.</li>
        <li>
          The administrator can block a product with a reason. You see the
          reason in your product list, receive it by email and cannot activate
          the product again until it is unblocked.
        </li>
      </ul>
    </StaticSection>

    <StaticSection id='orders' title='Orders'>
      <p>
        An order moves through <strong>New</strong>, <strong>Processing</strong>
        , <strong>Shipped</strong>, <strong>Delivered</strong> and{' '}
        <strong>Completed</strong>, or ends as <strong>Cancelled</strong>.
      </p>
      <ul>
        <li>A tracking number is required to ship an order.</li>
        <li>
          A paid order cannot be cancelled. It needs a refund by the platform
          administrator first.
        </li>
        <li>
          Delivery is arranged between the seller and the buyer and is shown on
          the order as billed separately.
        </li>
      </ul>
    </StaticSection>

    <StaticSection id='fees' title='Platform fee'>
      <p>
        The platform fee is <strong>5 percent of the order subtotal</strong>:
        the goods without VAT and delivery.
      </p>
      <ul>
        <li>Online card orders: deducted from your balance at payment.</li>
        <li>
          Other payment methods: recorded as a fee due when you complete the
          order.
        </li>
      </ul>
    </StaticSection>

    <StaticSection id='payouts' title='Payouts'>
      <ul>
        <li>Request any amount up to your available balance.</li>
        <li>The amount is reserved as soon as you send the request.</li>
        <li>
          The administrator completes or rejects the request. A rejection comes
          with a comment, and the amount returns to your balance.
        </li>
        <li>
          Bank details are taken from your profile at the time of the request.
        </li>
      </ul>
    </StaticSection>

    <StaticSection id='documents' title='Documents'>
      <ul>
        <li>The purchase order is created automatically with the order.</li>
        <li>The delivery note is generated with the tracking number.</li>
        <li>
          The proforma invoice, invoice and settlement statement are generated
          by you from the order page. The proforma and the invoice need the
          company name, IBAN and bank name in your profile.
        </li>
      </ul>
    </StaticSection>

    <StaticNote>
      These rules describe how the platform works today and may change as B2bar
      develops.
    </StaticNote>
  </StaticPage>
);

export default SellerRules;
