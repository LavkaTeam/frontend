import styles from './HeroSection.module.css';
import { heroCards } from '../../data/heroSliderData';
import { useHeroSlider } from '../../hooks/useHeroSlider';
import { CardHero } from '../CardHero/CardHero';

const HeroSection = () => {
  const { currentIndex, handleMouseDown, handleMouseUp } = useHeroSlider(heroCards);

  return (
    <section className={styles.HeroSection}>
      <div className="container">
        <div className={styles.heroSectionContainer}>
          {heroCards.map((card, index) => (
            <CardHero
              key={index}
              card={card}
              isActive={index === currentIndex}
              isPrev={index === (currentIndex - 1 + heroCards.length) % heroCards.length}
              isInactive={index !== currentIndex && index !== (currentIndex - 1 + heroCards.length) % heroCards.length}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { HeroSection };