import { useState } from 'react';

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

import styles from './Home.module.css';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const { products: bestsellers, isLoading: isBestsellersLoading } =
    useSearchProducts({
      mainCategory: 'BESTSELLERS',
      status: 'in stock',
    });

  const { products: relatedProducts, isLoading: isRelatedLoading } =
    useSearchProducts({
      mainCategory: 'RELATED_PRODUCTS',
      status: 'in stock',
    });

  const {
    products: topSelectProducts,
    isLoading: isTopSelectLoading,
    totalPages,
  } = useSearchProducts({
    mainCategory: 'TOP_SELECT',
    page: currentPage,
    size: 12,
    sort: ['quantity,desc'],
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage - 1);

    requestAnimationFrame(() => {
      const section = document.getElementById('top-select-anchor');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const renderSkeletons = (count = 4) => (
    <div className='container'>
      <div className={styles.skeletonGrid}>
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
            renderSkeletons(4)
          ) : (
            <CardSection
              cards={relatedProducts}
              CardComponent={CardProduct}
              withSlider={relatedProducts.length > 4}
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
              <CardSection
                cards={topSelectProducts}
                CardComponent={CardProduct}
              />

              {totalPages > 0 && (
                <Pagination
                  currentPage={currentPage + 1}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
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
