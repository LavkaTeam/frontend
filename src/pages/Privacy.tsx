import { StaticNote, StaticPage, StaticSection } from '@/components/StaticPage';
import { SUPPORT_EMAIL } from '@/utils/supportMailto';

import styles from './StaticPages.module.css';

// Update together with the text below.
const LAST_UPDATED = { iso: '2026-10-22', label: '22 October 2026' };

const Privacy = () => (
  <StaticPage
    title='Privacy Policy'
    eyebrow='Legal'
    description='What data B2bar collects, why, where it is stored and who to contact. B2bar is a demo project.'
    intro={
      <>
        <p>
          This page explains what data B2bar collects, why it is needed and
          where it is kept.
        </p>
        <p className={styles.lastUpdated}>
          Last updated:{' '}
          <time dateTime={LAST_UPDATED.iso}>{LAST_UPDATED.label}</time>
        </p>
      </>
    }
  >
    <StaticNote>
      B2bar is a demo and portfolio project. This policy is a plain-language
      template, not legal advice, and it does not claim compliance with any
      specific law. Please do not upload real confidential documents.
    </StaticNote>

    <StaticSection id='data' title='What we collect'>
      <ul>
        <li>
          <strong>Account data:</strong> your name, email address, phone number
          and password (stored only as a hash).
        </li>
        <li>
          <strong>Company data:</strong> company name, registration number, tax
          ID, VAT number, legal address and logo.
        </li>
        <li>
          <strong>Bank details and licence:</strong> bank name, IBAN, BIC, the
          liquor licence number and the licence file you upload.
        </li>
        <li>
          <strong>Orders and documents:</strong> carts, orders, delivery
          details, payments recorded in the system and the order documents
          generated from them.
        </li>
      </ul>
    </StaticSection>

    <StaticSection id='purpose' title='Why we use it'>
      <ul>
        <li>To create and secure your account.</li>
        <li>To verify companies before they buy or sell.</li>
        <li>
          To process orders, generate order documents and keep seller finances
          and payouts.
        </li>
        <li>
          To send emails you need: confirmation and password reset links,
          verification decisions and order or payout notifications.
        </li>
      </ul>
    </StaticSection>

    <StaticSection id='storage' title='Where it is stored and who processes it'>
      <ul>
        <li>
          Uploaded files (product images, logos, licence files) and generated
          order documents are stored with <strong>Cloudinary</strong>.
        </li>
        <li>
          Emails are sent through <strong>Brevo</strong>.
        </li>
        <li>
          Other data is kept in the B2bar database and is not sold to anyone.
        </li>
      </ul>
    </StaticSection>

    <StaticSection id='who-sees' title='Who can see your data'>
      <ul>
        <li>
          The other party of an order sees the details needed for it, such as
          company name, delivery details and order documents.
        </li>
        <li>
          The platform administrator sees company profiles and licence files to
          review companies, and orders and payouts to run the platform.
        </li>
      </ul>
    </StaticSection>

    <StaticSection id='rights' title='Your choices'>
      <p>
        You can view and edit your profile in your account at any time. To ask
        about your data or to have it deleted, write to us.
      </p>
    </StaticSection>

    <StaticSection id='contact' title='Contact'>
      <p>
        Questions about this policy:{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </StaticSection>
  </StaticPage>
);

export default Privacy;
