import {
  CardGrid,
  InfoCard,
  StaticCta,
  StaticPage,
  StaticSection,
} from '@/components/StaticPage';
import { ButtonLink } from '@/components/ui/Button';
import { articles } from '@/data/articlesData';
import type { ProductCategory } from '@/types/productCard';

const CATEGORIES: { id: ProductCategory; label: string; text: string }[] = [
  {
    id: 'WINE',
    label: 'Wine',
    text: 'Red, white, rosé, sparkling, dessert and fortified.',
  },
  {
    id: 'BEER',
    label: 'Beer',
    text: 'Light, dark, craft and non-alcoholic.',
  },
  {
    id: 'STRONG_DRINKS',
    label: 'Strong drinks',
    text: 'Whiskey, vodka, gin, rum, cognac, brandy and liqueurs.',
  },
  {
    id: 'LOW_ALCOHOL_DRINKS',
    label: 'Low alcohol',
    text: 'Canned cocktails, alcopops, vermouth and aperitifs.',
  },
  {
    id: 'SOFT_DRINKS',
    label: 'Soft drinks',
    text: 'Tonics, mixers, carbonated drinks and cocktail juices.',
  },
  {
    id: 'BARWARE_ACCESSORIES',
    label: 'Barware and accessories',
    text: 'Glassware, bar tools, chillers, decor and serving gear.',
  },
];

const Promotions = () => (
  <StaticPage
    title='Discounts and Promotions'
    eyebrow='Better prices'
    description='How prices work on B2bar: wholesale price tiers for larger orders and promotional prices set by sellers.'
    intro={
      <p>
        B2bar has no coupons or invented sales. Prices go down in two ways, both
        set by the sellers and shown right on the product.
      </p>
    }
  >
    <CardGrid columns={2}>
      <InfoCard title='Wholesale price tiers' marker='%'>
        <p>
          Sellers can set lower unit prices for larger quantities. The product
          page lists the tiers, and the cart applies the tier with the highest
          minimum quantity that your quantity reaches.
        </p>
      </InfoCard>
      <InfoCard title='Promotional prices' marker='★'>
        <p>
          A seller can put a promotional price on a product. It is shown next to
          the regular price with a sale badge and takes priority over the
          wholesale tiers.
        </p>
      </InfoCard>
    </CardGrid>

    <StaticSection id='categories' title='Shop by category' variant='plain'>
      <CardGrid>
        {CATEGORIES.map((category) => (
          <InfoCard
            key={category.id}
            title={category.label}
            to={`/products?category=${category.id}`}
            linkLabel='Browse'
          >
            <p>{category.text}</p>
          </InfoCard>
        ))}
      </CardGrid>
    </StaticSection>

    <StaticSection id='articles' title='From Discover' variant='plain'>
      <CardGrid columns={2}>
        {articles.map((article) => (
          <InfoCard
            key={article.slug}
            title={article.title}
            image={article.cover}
            to={article.path}
            linkLabel='Read more'
          >
            <p>{article.excerpt}</p>
          </InfoCard>
        ))}
      </CardGrid>
    </StaticSection>

    <StaticCta>
      <ButtonLink to='/products'>Browse the catalog</ButtonLink>
    </StaticCta>
  </StaticPage>
);

export default Promotions;
