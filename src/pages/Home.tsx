import { useState } from 'react';

import { discoverCards } from '@/data/discoverData';
import { useSearchProducts } from '@/hooks/useSearchProducts';

import { HeaderMenu } from '../components/HeaderMenu';
import { HeroSection } from '../components/HeroSection';
import { CardSection } from '@/components/CardSection';
import { CardDiscover } from '@/components/CardDiscover';
import { CardProduct } from '@/components/CardProduct';
import { Pagination } from '@/components/Pagination';
import { PageSection } from '@/components/PageSection/PageSection';
import { Loader } from '@/components/ui/Loader';
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
  33;
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage - 1);

    requestAnimationFrame(() => {
      const section = document.getElementById('top-select-anchor');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  return (
    <>
      <HeaderMenu />
      <main>
        <HeroSection />

        <PageSection title='Bestsellers'>
          {isBestsellersLoading ? (
            <div className={styles.loadingContainerStyle}>
              <Loader variant='section' />
            </div>
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
            <div className={styles.loadingContainerStyle}>
              <Loader variant='section' />
            </div>
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
            <div className={styles.loadingContainerStyle}>
              <Loader variant='section' />
            </div>
          ) : (
            <>
              <CardSection
                cards={topSelectProducts}
                CardComponent={CardProduct}
              />

              <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />

              <Space height='80px' />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
