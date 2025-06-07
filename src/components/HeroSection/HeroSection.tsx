import styles from './HeroSection.module.css';
import { heroCards } from '../../data/heroSliderData';
import { useHeroSlider } from '../../hooks/useHeroSlider';

const HeroSection = () => {
  const { currentIndex, handleMouseDown, handleMouseUp } = useHeroSlider(heroCards);

  return (
    <section className={styles.HeroSection}>
      <div className="container">
        <div className={styles.heroSectionContainer}>
          {heroCards.map((card, index) => (
            <div
              key={index}
              className={`${styles.heroCard} ${
                index === currentIndex
                  ? styles.active
                  : index === (currentIndex - 1 + heroCards.length) % heroCards.length
                  ? styles.prev
                  : styles.inactive
              }`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <img src={card.img} alt={card.alt} />
              <div className={styles.heroCardInfo}>
                <h2 className={styles.heroCardTitle}>{card.title}</h2>
                <p className={styles.heroCardText}>{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HeroSection };