import styles from './CardHero.module.css';
import type { HeroCard } from '@data/heroSliderData';

interface CardHeroProps {
  card: HeroCard;
  isActive: boolean;
  isPrev: boolean;
  isInactive: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

const CardHero = ({
  card,
  isActive,
  isPrev,
  isInactive,
  onMouseDown,
  onMouseUp,
}: CardHeroProps) => {
  return (
    <div
      className={`${styles.cardHero} ${isActive ? styles.active : ''} ${
        isPrev ? styles.prev : ''
      } ${isInactive ? styles.inactive : ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <img src={card.img} alt={card.alt} />
      <div className={styles.cardHeroInfo}>
        <h2 className={styles.cardHeroTitle}>{card.title}</h2>
        <p className={styles.cardHeroText}>{card.text}</p>
      </div>
    </div>
  );
};

export { CardHero };
