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
}

const CardSection = <T extends WithId>({
  title,
  cards = [],
  withSlider = false,
  CardComponent,
  noPaddings = false,
}: CardSectionProps<T>) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const hasCards = cards && cards.length > 0;

  return (
    <section className={styles.cardSection}>
      <div className={noPaddings ? '' : 'container'}>
        {title ? <HeadingH3>{title}</HeadingH3> : null}

        <div className={styles.sliderWrapper}>
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
                  modules={[Navigation, Pagination]}
                  spaceBetween={24}
                  slidesPerView={1.2}
                  loop={true}
                  pagination={{ clickable: true }}
                  className={styles.swiperContainer}
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
                    320: { slidesPerView: 1.2, spaceBetween: 16 },
                    560: { slidesPerView: 2.2, spaceBetween: 20 },
                    900: { slidesPerView: 3.2, spaceBetween: 24 },
                    1200: { slidesPerView: 4, spaceBetween: 24 },
                  }}
                >
                  {cards.map((card) => (
                    <SwiperSlide key={card.id} className={styles.slideItem}>
                      <div className={styles.cardWrapper}>
                        <CardComponent card={card} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            ) : (
              <div className={styles.gridCardContainer}>
                {cards.map((card) => (
                  <CardComponent key={card.id} card={card} />
                ))}
              </div>
            )
          ) : (
            <NoProductsFound />
          )}
        </div>
      </div>
    </section>
  );
};

export { CardSection };
