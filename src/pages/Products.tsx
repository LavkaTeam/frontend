import { useSearchParams } from 'react-router-dom';

import { useSearchProducts } from '@/hooks/useSearchProducts';

import { FilterBlock } from '@/components/Filters/FilterBlock';
import { CardSection } from '@/components/CardSection';
import { CardProduct } from '@/components/CardProduct';
import { Pagination } from '@/components/Pagination';
import { Loader } from '@/components/ui/Loader';
import { Space } from '@/components/ui/Space';
import { HeaderMenu } from '@/components/HeaderMenu';
import { NoProductsFound } from '@/components/NoProductsFound/NoProductsFound';

import styles from './Products.module.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Math.max(1, Number(pageParam)) : 1;

  const category = searchParams.get('category') || undefined;
  const subcategory = searchParams.get('subcategory') || undefined;
  // const priceFrom = searchParams.get('priceFrom');
  // const priceTo = searchParams.get('priceTo');
  // const country = searchParams.get('country') || undefined;
  // const promotions =
  //   searchParams.get('promotions') === 'true' ? true : undefined;
  // const capacities = searchParams.getAll('capacity');
  // const strengths = searchParams.getAll('strength');

  const {
    products: normalProducts,
    isLoading: isNormalProductsLoading,
    totalPages,
  } = useSearchProducts({
    category,
    subcategory,

    // minPrice: priceFrom ? Number(priceFrom) : undefined,
    // maxPrice: priceTo ? Number(priceTo) : undefined,
    // producer: country,

    page: currentPage - 1,
    size: 12,
    sort: ['quantity,desc'],
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('page', newPage.toString());
      return newParams;
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='container'>
      <HeaderMenu />
      <div className={styles.container}>
        <FilterBlock />

        <div className={styles.wrapper}>
          <div className={styles.catalogContent}>
            {isNormalProductsLoading ? (
              <div className={styles.loaderWrapper}>
                <Loader variant='section' />
              </div>
            ) : (
              <>
                {normalProducts.length === 0 ? (
                  <NoProductsFound />
                ) : (
                  <>
                    <CardSection
                      title={false}
                      cards={normalProducts}
                      CardComponent={CardProduct}
                      noPaddings={true}
                    />

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      noPaddings={true}
                    />
                  </>
                )}
                <Space height='48px' />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
