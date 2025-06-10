import { HeaderMenu } from '../components/HeaderMenu';
import { HeroSection } from '../components/HeroSection';
import { BestsellersSection } from '../components/BestsellersSection';
import { DiscoverSection } from '../components/DiscoverSection';

const Home = () => {
  return (
    <div>
      <HeaderMenu />
      <HeroSection />
      <BestsellersSection />
      <DiscoverSection />
    </div>
  );
};

export { Home };