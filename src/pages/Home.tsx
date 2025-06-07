import { HeaderMenu } from '../components/HeaderMenu';
import { HeroSection } from '../components/HeroSection';
import { CardList } from '../components/CardList';
import { Heading } from '../components/Heading';

const Home = () => {
  return (
    <div>
      <HeaderMenu />
      <HeroSection />
      <Heading>Bestsellers</Heading>
      <CardList />
    </div>
  );
};

export { Home };