import { ArrowButton } from '../ui/icons/ArrowButton';
import { useSlider } from '@hooks/useSlider';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '../ui/Space';

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
}

const CARDS_PER_PAGE = 4;

const CardSection = <T extends WithId>({
  title,
  cards,
  withSlider = false,
  CardComponent,
  noPaddings = false,
}: CardSectionProps<T>) => {
  const { currentIndex, handleNext, handlePrev } = useSlider(
    cards?.length || 0,
    CARDS_PER_PAGE,
  );

  const visibleCards = withSlider
    ? cards?.slice(currentIndex, currentIndex + CARDS_PER_PAGE) || []
    : cards || [];

  return (
    <section className={styles.cardSection}>
      <div className={noPaddings ? '' : 'container'}>
        {title ? <HeadingH3>{title}</HeadingH3> : null}
        <Space height='32px' />
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
