import { HeaderMenu } from '../components/HeaderMenu';
import { HeroSection } from '../components/HeroSection';
import { CardSection } from '@/components/CardSection';
import { CardDiscover } from '@/components/CardDiscover';
import { CardProduct } from '@/components/CardProduct';
import { Pagination } from '@/components/Pagination';
import { discoverCards } from '@/data/discoverData';
import { productData } from '@/data/productData';
import { PageSection } from '@/components/PageSection/PageSection';

const Home = () => {
  return (
    <>
      <HeaderMenu />
      <main>
        <HeroSection />

        <PageSection title='Bestsellers'>
          <CardSection
            cards={productData}
            CardComponent={CardProduct}
            withSlider={true}
          />
        </PageSection>

        <PageSection title='Discover'>
          <CardSection cards={discoverCards} CardComponent={CardDiscover} />
        </PageSection>

        <PageSection title='Related products'>
          <CardSection
            cards={productData}
            CardComponent={CardProduct}
            withSlider={true}
          />
          <CardSection cards={productData} CardComponent={CardProduct} />
          <Pagination />
        </PageSection>
      </main>
    </>
  );
};

export default Home;
