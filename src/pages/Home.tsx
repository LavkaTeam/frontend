import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { discoverCards } from '@/data/discoverData';
import { useSearchProducts } from '@/hooks/useSearchProducts';

import { HeaderMenu } from '../components/HeaderMenu';
import { HeroSection } from '../components/HeroSection';
import { CardSection } from '@/components/CardSection';
import { CardDiscover } from '@/components/CardDiscover';
import { CardProduct } from '@/components/CardProduct';
import { CardProductSkeleton } from '@/components/CardProduct';
import { Pagination } from '@/components/Pagination';
import { PageSection } from '@/components/PageSection/PageSection';
import { Divider } from '@/components/ui/Divider';
import { Space } from '@/components/ui/Space';
import { Button } from '@/components/ui/Button';
import {
  CardRelatedLead,
  CardRelatedLeadSkeleton,
} from '@/components/CardRelatedLead';

import styles from './Home.module.css';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Home = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const { products: rawBestsellers, isLoading: isBestsellersLoading } =
    useSearchProducts(
      {
        mainCategory: 'BESTSELLERS',
      },
      { skipFilters: true },
    );

  const { products: rawRelatedProducts, isLoading: isRelatedLoading } =
    useSearchProducts(
      {
        mainCategory: 'RELATED_PRODUCTS',
      },
      { skipFilters: true },
    );

  const bestsellers = useMemo(
    () => shuffleArray(rawBestsellers),
    [rawBestsellers],
  );
  const relatedProducts = useMemo(
    () => shuffleArray(rawRelatedProducts),
    [rawRelatedProducts],
  );

  const {
    products: topSelectProducts,
    isLoading: isTopSelectLoading,
    isFetching: isTopSelectFetching,
    totalPages,
    isLastPage: isTopSelectLastPage,
  } = useSearchProducts(
    {
      mainCategory: 'TOP_SELECT',
      page: currentPage,
      size: 12,
      sort: ['quantity,desc'],
    },
    { skipFilters: true },
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage - 1);

    requestAnimationFrame(() => {
      const section = document.getElementById('top-select-anchor');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const renderSkeletons = (count = 4, hasLead = false) => (
    <div className='container'>
      <div className={hasLead ? styles.skeletonMixed : styles.skeletonGrid}>
        {hasLead && <CardRelatedLeadSkeleton />}
        {Array.from({ length: count }).map((_, index) => (
          <CardProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <HeaderMenu />
      <main>
        <HeroSection />

        <PageSection title='Bestsellers'>
          {isBestsellersLoading ? (
            renderSkeletons(4)
          ) : (
            <CardSection
              cards={bestsellers}
              CardComponent={CardProduct}
              withSlider={bestsellers.length > 4}
            />
          )}
        </PageSection>

        <PageSection title='Discover'>
          <CardSection cards={discoverCards} CardComponent={CardDiscover} />
        </PageSection>

        <PageSection title='Related products'>
          {isRelatedLoading ? (
            renderSkeletons(4, true)
          ) : (
            <CardSection
              cards={relatedProducts}
              CardComponent={CardProduct}
              withSlider={relatedProducts.length > 4}
              leadCard={<CardRelatedLead />}
            />
          )}
        </PageSection>

        <Divider />
        <Space height='48px' />

        <div id='top-select-anchor' className={styles.scrollAnchor}>
          {isTopSelectLoading ? (
            renderSkeletons(8) // Для сітки Top Select показуємо більше скелетонів
          ) : (
            <>
              <div className={styles.topSelectSection}>
                <CardSection
                  cards={topSelectProducts}
                  CardComponent={CardProduct}
                  noBottomMargin
                  isFetching={isTopSelectFetching}
                  footer={
                    isTopSelectLastPage && totalPages > 0 ? (
                      <Link
                        to='/products'
                        className={styles.topSelectButtonLink}
                      >
                        <Button>View all products</Button>
                      </Link>
                    ) : null
                  }
                />
              </div>

              {totalPages > 0 && (
                <div className={styles.topSelectPagination}>
                  <Pagination
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              <Space height='80px' />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
