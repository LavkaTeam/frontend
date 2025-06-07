import { HeaderMenu } from '../components/HeaderMenu';
import { HeroSection } from '../components/HeroSection';
import { CardList } from '../components/CardList';
import { Heading } from '../components/Heading';
import { DiscoverSection } from '../components/DiscoverSection';

const Home = () => {
  return (
    <div>
      <HeaderMenu />
      <HeroSection />
      <Heading>Bestsellers</Heading>
      <CardList />
      <DiscoverSection />
    </div>
  );
};

export { Home };