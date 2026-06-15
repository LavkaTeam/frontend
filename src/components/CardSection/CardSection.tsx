import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ArrowButton } from '../ui/icons/ArrowButton';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { NoProductsFound } from '../NoProductsFound';

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
  leadCard?: React.ReactNode;
  footer?: React.ReactNode;
  noBottomMargin?: boolean;
  isFetching?: boolean;
}

const CardSection = <T extends WithId>({
  title,
  cards = [],
  withSlider = false,
  CardComponent,
  noPaddings = false,
  leadCard,
  footer,
  noBottomMargin = false,
  isFetching = false,
}: CardSectionProps<T>) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const hasCards = cards && cards.length > 0;
  const hasLeadCard = Boolean(leadCard);

  return (
    <section
      className={`${styles.cardSection} ${
        noBottomMargin ? styles.noBottomMargin : ''
      }`}
    >
      <div className={noPaddings ? '' : 'container'}>
        {title ? <HeadingH3>{title}</HeadingH3> : null}

        <div
          className={`${styles.sliderWrapper} ${
            isFetching ? styles.sliderWrapperFetching : ''
          }`}
        >
          {hasCards ? (
            withSlider ? (
              <>
                <div className={styles.navigationButtons}>
                  <div
                    ref={prevRef}
                    className={`${styles.arrowButton} ${styles.leftButton}`}
                  >
                    <ArrowButton direction='left' />
                  </div>
                  <div
                    ref={nextRef}
                    className={`${styles.arrowButton} ${styles.rightButton}`}
                  >
                    <ArrowButton direction='right' />
                  </div>
                </div>

                <Swiper
                  key={`swiper-${cards.length}-${hasLeadCard}`}
                  modules={[Navigation, Pagination]}
                  spaceBetween={24}
                  slidesPerView='auto'
                  slidesPerGroup={1}
                  loop={hasCards && cards.length >= 4}
                  watchOverflow={true}
                  pagination={hasLeadCard ? false : { clickable: true }}
                  className={`${styles.swiperContainer} ${
                    hasLeadCard ? styles.mixedSwiperContainer : ''
                  }`}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  onBeforeInit={(swiper: SwiperType) => {
                    if (
                      typeof swiper.params.navigation !== 'boolean' &&
                      swiper.params.navigation
                    ) {
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                    }
                  }}
                  breakpoints={{
                    320: {
                      spaceBetween: 16,
                    },
                    768: {
                      spaceBetween: 20,
                    },
                    1024: {
                      spaceBetween: 24,
                    },
                  }}
                >
                  {leadCard && (
                    <SwiperSlide
                      key='leadCard'
                      className={`${styles.slideItem} ${styles.autoWidthSlide}`}
                    >
                      {leadCard}
                    </SwiperSlide>
                  )}
                  {cards.map((card) => (
                    <SwiperSlide
                      key={card.id}
                      className={`${styles.slideItem} ${styles.autoWidthSlide}`}
                    >
                      <div className={styles.cardWrapper}>
                        <CardComponent card={card} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            ) : (
              <div className={styles.gridCardContainer}>
                {leadCard && leadCard}
                {cards.map((card) => (
                  <CardComponent key={card.id} card={card} />
                ))}
              </div>
            )
          ) : (
            <NoProductsFound />
          )}

        </div>

        {footer ? <div className={styles.sectionFooter}>{footer}</div> : null}
      </div>
    </section>
  );
};

export { CardSection };
