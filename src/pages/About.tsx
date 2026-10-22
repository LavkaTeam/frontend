import {
  CardGrid,
  InfoCard,
  StaticCta,
  StaticNote,
  StaticPage,
  StaticSection,
} from '@/components/StaticPage';
import { ButtonLink } from '@/components/ui/Button';

const CAPABILITIES = [
  {
    title: 'Catalog and search',
    text: 'Categories, filters and search across wine, beer, strong drinks, low-alcohol and soft drinks, and barware.',
  },
  {
    title: 'Wholesale price tiers',
    text: 'Sellers set prices by quantity, so the unit price follows the volume you order.',
  },
  {
    title: 'One checkout, several suppliers',
    text: 'A cart with products from several sellers becomes one order per seller, each with its own status.',
  },
  {
    title: 'Order documents',
    text: 'Purchase orders, proforma invoices, invoices and delivery notes as PDF files on the order page.',
  },
  {
    title: 'Seller finances',
    text: 'Balance, platform fees, transaction history and payout requests in the seller account.',
  },
  {
    title: 'Seller analytics',
    text: 'Revenue, orders and best-selling categories on one dashboard.',
  },
];

const About = () => (
  <StaticPage
    title='About us'
    eyebrow='B2bar marketplace'
    description='B2bar is a B2B marketplace that connects drinks suppliers with bars, restaurants, HoReCa and wholesale buyers.'
    intro={
      <p>
        B2bar is a B2B marketplace for the drinks trade. It connects suppliers
        with bars, restaurants, hotels, catering and wholesale buyers in one
        catalog, with one checkout and the paperwork each order needs.
      </p>
    }
  >
    <CardGrid columns={2}>
      <InfoCard title='For buyers' marker='B'>
        <p>
          Register your company, get verified and order from several suppliers
          at once. Compare products and wholesale prices, track every order and
          download its documents.
        </p>
      </InfoCard>
      <InfoCard title='For sellers' marker='S'>
        <p>
          Verify your company, publish products with wholesale price tiers,
          process orders and follow your balance, fees and payouts in one
          account.
        </p>
      </InfoCard>
    </CardGrid>

    <StaticSection id='how-it-works' title='How it works'>
      <ol>
        <li>
          A company registers, confirms its email and fills in the company
          profile with the alcohol licence.
        </li>
        <li>
          The platform administrator reviews the company. Verified buyers can
          check out; verified sellers can list products.
        </li>
        <li>
          The buyer places one checkout; each seller receives their own order
          and moves it from new to completed.
        </li>
        <li>
          Documents are generated for the order, and the seller’s balance and
          payouts are kept in the finance section.
        </li>
      </ol>
    </StaticSection>

    <StaticSection
      id='capabilities'
      title='What the platform does'
      variant='plain'
    >
      <CardGrid>
        {CAPABILITIES.map((item) => (
          <InfoCard key={item.title} title={item.title}>
            <p>{item.text}</p>
          </InfoCard>
        ))}
      </CardGrid>
    </StaticSection>

    <StaticNote>
      B2bar is a demo and portfolio project. Companies, products and orders on
      the platform are test data, and online card payments are simulated.
    </StaticNote>

    <StaticCta>
      <ButtonLink to='/products'>Browse the catalog</ButtonLink>
      <ButtonLink to='/become-a-seller' variant='secondary'>
        Become a seller
      </ButtonLink>
    </StaticCta>
  </StaticPage>
);

export default About;
