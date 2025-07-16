import { ArrowButton } from '../ArrowButton';
import { useSlider } from '@hooks/useSlider';
import { Heading } from '@ui/Heading';

import styles from './CardSection.module.css';

interface WithId {
  id: string | number;
}

interface CardSectionProps<T extends WithId> {
  title?: string | false;
  cards?: T[];
  CardComponent: React.ComponentType<{ card: T }>;
  withSlider?: boolean;
  noPaddings?: boolean;
  cardsPerPage?: number;
}

const CARDS_PER_PAGE_DEFAULT = 4;

const CardSection = <T extends WithId>({
  title,
  cards,
  withSlider = false,
  CardComponent,
  noPaddings = false,
  cardsPerPage = CARDS_PER_PAGE_DEFAULT,
}: CardSectionProps<T>) => {
  const { currentIndex, handleNext, handlePrev } = useSlider(
    cards?.length || 0,
    cardsPerPage
  );

  const displayedCards = cards?.slice(0, cardsPerPage) || [];
  const visibleCards = withSlider
    ? cards?.slice(currentIndex, currentIndex + cardsPerPage) || []
    : displayedCards;

  return (
    <section className={styles.cardSection}>
      <div className={noPaddings ? '' : 'container'}>
        {title ? <Heading>{title}</Heading> : null}
        <div className={styles.sliderWrapper}>
          {withSlider && (
            <div className={`${styles.arrowButton} ${styles.leftButton}`}>
              <ArrowButton direction='left' onClick={handlePrev} />
            </div>
          )}

          {visibleCards && visibleCards.length > 0 ? (
            <div
              className={
                withSlider ? styles.cardContainer : styles.gridCardContainer
              }
            >
              {visibleCards.map((card) => (
                <CardComponent key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <p>No cards available</p>
          )}

          {withSlider && (
            <div className={`${styles.arrowButton} ${styles.rightButton}`}>
              <ArrowButton direction='right' onClick={handleNext} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { CardSection };
