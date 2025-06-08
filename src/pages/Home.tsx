import { HeaderMenu } from '../components/HeaderMenu';
import { HeroSection } from '../components/HeroSection';
import { BestsellersSection } from '../components/BestsellersSection';

const Home = () => {
  return (
    <div>
      <HeaderMenu />
      <HeroSection />
      <BestsellersSection />
    </div>
  );
};

export { Home };