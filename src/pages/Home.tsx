import { HeaderMenu } from '../components/HeaderMenu';
import { HeroSection } from '../components/HeroSection';
import { CardSection } from '@/components/CardSection';
import { discoverCards } from '@/data/discoverData';
import { CardDiscover } from '@/components/CardDiscover';
import { CardProduct } from '@/components/CardProduct';
import { productData } from '@/data/productData';
import { Pagination } from '@/components/Pagination';

const Home = () => {
  return (
    <div>
      <HeaderMenu />
      <HeroSection />
      <CardSection
        title='Bestsellers'
        cards={productData}
        CardComponent={CardProduct}
        withSlider={true}
      />
      <CardSection
        title='Discover'
        cards={discoverCards}
        CardComponent={CardDiscover}
      />
      <CardSection
        title='Related products'
        cards={productData}
        CardComponent={CardProduct}
        withSlider={true}
      />
      <CardSection
        title={false}
        cards={productData}
        CardComponent={CardProduct}
      />
      <Pagination />
    </div>
  );
};

export { Home };
