import {
  CardGrid,
  InfoCard,
  StaticCta,
  StaticPage,
  StaticSection,
  StatusList,
} from '@/components/StaticPage';
import { ButtonLink } from '@/components/ui/Button';

import styles from './StaticPages.module.css';

const STEPS = [
  {
    title: 'Register and confirm your email',
    text: 'Create an account as a seller and open the confirmation link from your inbox. The link is valid for 30 minutes.',
  },
  {
    title: 'Fill in the company profile',
    text: 'Add your contact, company and bank details and the legal address in your account.',
  },
  {
    title: 'Upload the alcohol licence',
    text: 'Add the licence number and the licence file. Once the profile is complete, it is sent to review.',
  },
  {
    title: 'Wait for the review',
    text: 'The platform administrator checks your company. You get an email with the decision.',
  },
  {
    title: 'Add your products',
    text: 'Create products with photos, stock, minimum order quantity and wholesale price tiers.',
  },
  {
    title: 'Receive orders and payouts',
    text: 'Process orders, generate documents and request payouts from your balance.',
  },
];

const REQUIRED_DATA = [
  'First and last name',
  'Company name',
  'Registration number',
  'Tax ID',
  'VAT number',
  'Bank name',
  'IBAN',
  'BIC',
  'Liquor licence number',
  'Liquor licence file',
  'Legal address',
];

const BecomeSeller = () => (
  <StaticPage
    title='How to Become a Seller'
    eyebrow='For sellers'
    description='Step by step: register on B2bar, verify your company and start selling drinks to bars, restaurants and wholesale buyers.'
    intro={
      <p>
        Selling on B2bar takes a verified company profile. Here is the whole
        path from registration to your first payout.
      </p>
    }
  >
    <StaticSection
      id='steps'
      title='Six steps to start selling'
      variant='plain'
    >
      <CardGrid>
        {STEPS.map((step, index) => (
          <InfoCard key={step.title} title={step.title} marker={index + 1}>
            <p>{step.text}</p>
          </InfoCard>
        ))}
      </CardGrid>
    </StaticSection>

    <StaticSection id='profile-data' title='What the company profile needs'>
      <p>
        Every field below is required before the profile can be reviewed. The
        account page shows which ones are still missing.
      </p>
      <ul className={styles.chips} aria-label='Required profile data'>
        {REQUIRED_DATA.map((item) => (
          <li key={item} className={styles.chip}>
            {item}
          </li>
        ))}
      </ul>
      <p>
        <strong>Licence file:</strong> JPG, PNG, WEBP, PDF, DOC or DOCX, up to 5
        MB.
      </p>
    </StaticSection>

    <StaticSection id='verification' title='Verification statuses'>
      <StatusList
        items={[
          {
            name: 'Not submitted',
            code: 'NOT_VERIFIED',
            text: 'The profile is not complete yet. Fill in the missing fields to send it to review.',
          },
          {
            name: 'In review',
            code: 'PENDING',
            text: 'The profile is complete and waits for the administrator.',
          },
          {
            name: 'Verified',
            code: 'VERIFIED',
            text: 'You can create and edit products, see your finances and request payouts.',
          },
          {
            name: 'Rejected',
            code: 'REJECTED',
            text: 'You receive the reason by email and in your profile. Fix the data to send the profile to review again.',
          },
        ]}
      />
      <p>
        <strong>Keep in mind:</strong> changing the company data, bank details,
        licence or legal address of a verified company sends it back to review.
      </p>
    </StaticSection>

    <StaticCta>
      <ButtonLink to='/register'>Register as a seller</ButtonLink>
      <ButtonLink to='/account' variant='secondary'>
        Go to your profile
      </ButtonLink>
    </StaticCta>
  </StaticPage>
);

export default BecomeSeller;
