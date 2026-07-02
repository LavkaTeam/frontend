import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { useSearchProducts } from '@/hooks/useSearchProducts';
import { useProductFilters } from '@/hooks/useProductFilters';

import {
  FilterBlock,
  FilterBlockSkeleton,
} from '@/components/Filters/FilterBlock';
import { CardSection } from '@/components/CardSection';
import { CardProduct } from '@/components/CardProduct';
import { Pagination } from '@/components/Pagination';
import { HeaderMenu } from '@/components/HeaderMenu';
import { NoProductsFound } from '@/components/NoProductsFound/NoProductsFound';
import { CardProductSkeleton } from '@/components/CardProduct';
import { ProductSort } from '@/components/ProductSort';

import styles from './Products.module.css';

const Products = () => {
  const { category: pathCategory, subcategory: pathSubcategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Math.max(1, Number(pageParam)) : 1;
  const [isCatalogPageLoading, setIsCatalogPageLoading] = useState(false);

  const category = pathCategory || searchParams.get('category') || undefined;
  const subcategory =
    pathSubcategory || searchParams.get('subcategory') || undefined;
  const searchQuery = searchParams.get('name') || '';

  const {
    filters,
    updateFilter,
    toggleArrayFilter,
    clearAllFilters,
    updateSort,
  } = useProductFilters();

  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const country = filters.country || undefined;
  const promotions = filters.promotions ? true : undefined;
  const capacities = filters.capacities;
  const strengths = filters.strengths;
  const brands = filters.brands;
  const styleFilters = filters.styles;

  const {
    products: normalProducts,
    isLoading: isNormalProductsLoading,
    isFetching: isNormalProductsFetching,
    totalPages,
    metaFilters,
  } = useSearchProducts({
    category,
    subcategory: styleFilters.length > 0 ? styleFilters.join(',') : subcategory,
    producer: brands.length > 0 ? brands.join(',') : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    countryOfOrigin: country,
    promotionsOnly: promotions,
    volume: capacities.length > 0 ? capacities.map(Number) : undefined,
    alcoholRanges: strengths.length > 0 ? strengths : undefined,

    page: currentPage - 1,
    size: 12,
    sort: [filters.sort],
    name: searchQuery,
  });

  const { metaFilters: globalFilters } = useSearchProducts(
    {
      category,
      subcategory,
      name: searchQuery,
    },
    {
      skipProducts: true,
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  );

  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  let h1Text = 'All Products';
  if (subcategory) h1Text = formatName(subcategory);
  else if (category) h1Text = formatName(category);
  else if (searchQuery) h1Text = `Search results for: ${searchQuery}`;

  const catalogTopRef = useRef<HTMLDivElement>(null);
  const productsTopRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);
  const hasMountedFiltersRef = useRef(false);
  const filterSignature = JSON.stringify({
    minPrice,
    maxPrice,
    country,
    promotions,
    capacities,
    strengths,
    brands,
    styleFilters,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;

    setIsCatalogPageLoading(true);
    shouldScrollRef.current = true;
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', String(newPage));
      return newParams;
    });
  };

  const getStickyTopOffset = () => {
    const mainHeader = document.querySelector<HTMLElement>('header');
    const stickyHeaderMenu = document.querySelector<HTMLElement>(
      'section[class*="HeaderMenu"][class*="sticky"]',
    );

    const mainHeaderHeight =
      mainHeader && window.getComputedStyle(mainHeader).position === 'sticky'
        ? mainHeader.getBoundingClientRect().height
        : 0;

    const stickyHeaderMenuHeight =
      stickyHeaderMenu &&
      window.getComputedStyle(stickyHeaderMenu).position === 'sticky'
        ? stickyHeaderMenu.getBoundingClientRect().height
        : 0;

    return mainHeaderHeight + stickyHeaderMenuHeight;
  };

  const getScrollTop = (element: HTMLElement, offset: number) => {
    return element.getBoundingClientRect().top + window.scrollY - offset;
  };

  // Scroll to the absolute top of the page when category or subcategory changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, subcategory]);

  // Scroll to products section ONLY when page number is explicitly changed via handlePageChange
  useEffect(() => {
    if (shouldScrollRef.current && catalogTopRef.current) {
      const offset = getStickyTopOffset() + 8;
      const top = getScrollTop(catalogTopRef.current, offset);
      window.scrollTo({ top, behavior: 'smooth' });
      shouldScrollRef.current = false;
    }
  }, [currentPage]);

  useEffect(() => {
    if (!isCatalogPageLoading) return;

    if (!isNormalProductsFetching) {
      setIsCatalogPageLoading(false);
    }
  }, [isCatalogPageLoading, isNormalProductsFetching]);

  useEffect(() => {
    if (!hasMountedFiltersRef.current) {
      hasMountedFiltersRef.current = true;
      return;
    }

    if (!productsTopRef.current) return;

    const offset = getStickyTopOffset() + 8;
    const top = getScrollTop(productsTopRef.current, offset);
    window.scrollTo({ top, behavior: 'smooth' });
  }, [filterSignature]);

  const renderSkeletons = (count = 12) => (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: count }).map((_, index) => (
        <CardProductSkeleton key={index} />
      ))}
    </div>
  );

  const getActiveChips = () => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (filters.country)
      chips.push({
        label: filters.country,
        onRemove: () => updateFilter('country', null),
      });
    if (filters.promotions)
      chips.push({
        label: 'Promotions',
        onRemove: () => updateFilter('promotions', null),
      });
    if (filters.minPrice)
      chips.push({
        label: `From $${filters.minPrice}`,
        onRemove: () => updateFilter('minPrice', null),
      });
    if (filters.maxPrice)
      chips.push({
        label: `To $${filters.maxPrice}`,
        onRemove: () => updateFilter('maxPrice', null),
      });

    filters.capacities.forEach((cap) =>
      chips.push({
        label: `${cap}L`,
        onRemove: () => toggleArrayFilter('capacity', cap),
      }),
    );
    filters.strengths.forEach((str) =>
      chips.push({
        label: `${str}%`,
        onRemove: () => toggleArrayFilter('strength', str),
      }),
    );
    filters.brands.forEach((b) =>
      chips.push({ label: b, onRemove: () => toggleArrayFilter('brand', b) }),
    );
    filters.styles.forEach((s) =>
      chips.push({ label: s, onRemove: () => toggleArrayFilter('style', s) }),
    );

    return chips;
  };
  const activeChips = getActiveChips();

  return (
    <div className='container'>
      <HeaderMenu isSticky />

      <div
        className={styles.hero}
        style={{ backgroundImage: 'url("/catalog-hero-bg-v2.png")' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.breadcrumbs}>
            <Link
              to='/products'
              className={`${styles.breadcrumbItem} ${styles.root}`}
            >
              Catalog
            </Link>
            {category && (
              <>
                <span className={styles.breadcrumbSeparator}>&gt;</span>
                <Link
                  to={`/products?category=${category}`}
                  className={styles.breadcrumbItem}
                >
                  {formatName(category)}
                </Link>
              </>
            )}
            {subcategory && (
              <>
                <span className={styles.breadcrumbSeparator}>&gt;</span>
                <span className={styles.breadcrumbItem}>
                  {formatName(subcategory)}
                </span>
              </>
            )}
          </div>
          <h1 className={styles.heroTitle}>Catalog</h1>
          <p className={styles.heroSubtitle}>
            The widest selection of premium alcohol for your business.
          </p>
        </div>
      </div>

      <div className={styles.headerSection} ref={catalogTopRef}>
        <div className={styles.headerTopArea}>
          <div className={styles.titleWithChips}>
            <div className={styles.titleContainer}>
              <h2 className={styles.sectionTitle}>{h1Text}</h2>
            </div>

            {activeChips.length > 0 && (
              <div className={styles.chipsContainer}>
                {activeChips.map((chip, idx) => (
                  <div
                    key={idx}
                    className={styles.chip}
                    onClick={chip.onRemove}
                  >
                    {chip.label}
                    <span className={styles.chipRemoveBtn}>✕</span>
                  </div>
                ))}
                {activeChips.length > 1 && (
                  <button
                    className={styles.clearAllBtn}
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>

          <ProductSort value={filters.sort} onChange={updateSort} />
        </div>
      </div>

      <div className={styles.container}>
        {isNormalProductsLoading ? (
          <FilterBlockSkeleton />
        ) : (
          <FilterBlock
            metaFilters={metaFilters}
            globalFilters={globalFilters}
          />
        )}

        <div className={styles.wrapper}>
          <div className={styles.catalogContent}>
            <div ref={productsTopRef} />
            {isNormalProductsLoading ? (
              renderSkeletons(12)
            ) : normalProducts.length === 0 ? (
              <NoProductsFound onClearFilters={clearAllFilters} />
            ) : (
              <div
                className={styles.productsContainer}
              >
                <CardSection
                  title={false}
                  cards={normalProducts}
                  CardComponent={CardProduct}
                  noPaddings={true}
                  overlayActive={isCatalogPageLoading}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  noPaddings={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
