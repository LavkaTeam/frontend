import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { usePublicSellerProducts } from '@/hooks/usePublicSellerProducts';
import { usePublicSellerProfile } from '@/hooks/usePublicSellerProfile';

import { CardSection } from '@/components/CardSection';
import { CardProduct } from '@/components/CardProduct';
import { CardProductSkeleton } from '@/components/CardProduct';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { NoProductsFound } from '@/components/NoProductsFound/NoProductsFound';
import { Pagination } from '@/components/Pagination';
import { Space } from '@/components/ui/Space';

import styles from './SellerProductsPublic.module.css';

const getSellerName = (
  companyName?: string,
  displayName?: string,
  firstName?: string,
  lastName?: string,
) => {
  if (companyName) return companyName;
  if (displayName) return displayName;

  return [firstName, lastName].filter(Boolean).join(' ') || "Seller's Collection";
};

const SellerProductsPublic = () => {
  const { sellerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Math.max(1, Number(pageParam)) : 1;
  const [isSellerPageLoading, setIsSellerPageLoading] = useState(false);

  const {
    seller,
    isLoading: isSellerLoading,
  } = usePublicSellerProfile(sellerId);
  const { products, totalPages, isLoading, isFetching } =
    usePublicSellerProducts(sellerId, currentPage - 1, 12);

  useEffect(() => {
    if (!isSellerPageLoading) return;

    if (!isFetching) {
      setIsSellerPageLoading(false);
    }
  }, [isFetching, isSellerPageLoading]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    setIsSellerPageLoading(true);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sellerName = getSellerName(
    seller?.companyName,
    seller?.displayName,
    seller?.firstName,
    seller?.lastName,
  );
  const sellerLocation = [seller?.city, seller?.country].filter(Boolean).join(', ');
  const showDisplayName =
    seller?.displayName &&
    seller.displayName !== seller.companyName &&
    seller.displayName !== sellerName;
  const sellerStatusLabel = seller?.verifiedSeller
    ? 'Verified seller'
    : 'Public seller';
  const activeProductsCount = seller?.activeProductsCount ?? 0;
  const inStockProductsCount = seller?.inStockProductsCount ?? 0;
  const managerName = [seller?.firstName, seller?.lastName]
    .filter(Boolean)
    .join(' ');
  const inventorySummary =
    activeProductsCount === inStockProductsCount
      ? [`${activeProductsCount} active products / in stock`]
      : [
          `${activeProductsCount} active products`,
          `${inStockProductsCount} in stock`,
        ];

  return (
    <div className='container'>
      <div className={styles.header}>
        <div className={styles.breadcrumbs}>
          <Link to='/products' className={styles.breadcrumbLink}>
            Catalog
          </Link>
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <span className={styles.breadcrumbCurrent}>
            Seller&apos;s products
          </span>
        </div>

        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            <div className={styles.summaryBlock}>
              {isSellerLoading ? (
                <div className={styles.identityBlock}>
                  <div className={styles.logoSkeleton}></div>
                  <div className={styles.headerTitleBlockSkeleton}>
                    <div className={styles.titleSkeleton}></div>
                    <div className={styles.subtitleSkeleton}></div>
                  </div>
                </div>
              ) : (
                <div className={styles.identityBlock}>
                  {seller?.logoUrl ? (
                    <div className={styles.logoWrap}>
                      <img
                        src={seller.logoUrl}
                        alt={seller.companyName || seller.displayName || 'Seller logo'}
                        className={styles.logo}
                      />
                    </div>
                  ) : null}

                  <div className={styles.headerTitleBlock}>
                    <HeadingH3>{sellerName}</HeadingH3>
                    {showDisplayName ? (
                      <p className={styles.displayName}>{seller.displayName}</p>
                    ) : null}
                    <p className={styles.subtitle}>
                      {seller
                        ? `Public products from ${sellerName} in one place.`
                        : 'All public products from this seller in one place.'}
                    </p>
                  </div>
                </div>
              )}

              {isSellerLoading ? (
                <div className={styles.metaSkeletonRow}>
                  <div className={styles.metaSkeleton}></div>
                  <div className={styles.metaSkeleton}></div>
                  <div className={styles.metaSkeleton}></div>
                </div>
              ) : seller ? (
                <>
                  <div className={styles.inlineStats}>
                    <span
                      className={`${styles.inlineStat} ${
                        seller.verifiedSeller ? styles.verifiedStat : ''
                      }`}
                    >
                      {seller.verifiedSeller ? (
                        <svg
                          className={styles.verifiedIcon}
                          viewBox='0 0 20 20'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          aria-hidden='true'
                        >
                          <path
                            d='M10 1.66663L12.575 4.27496L16.2083 4.05829L15.9917 7.69163L18.3333 10L15.9917 12.3083L16.2083 15.9416L12.575 15.725L10 18.3333L7.425 15.725L3.79167 15.9416L4.00833 12.3083L1.66667 10L4.00833 7.69163L3.79167 4.05829L7.425 4.27496L10 1.66663Z'
                            fill='currentColor'
                            fillOpacity='0.14'
                          />
                          <path
                            d='M6.75 10L8.95 12.2L13.25 7.89996'
                            stroke='currentColor'
                            strokeWidth='1.9'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M10 1.66663L12.575 4.27496L16.2083 4.05829L15.9917 7.69163L18.3333 10L15.9917 12.3083L16.2083 15.9416L12.575 15.725L10 18.3333L7.425 15.725L3.79167 15.9416L4.00833 12.3083L1.66667 10L4.00833 7.69163L3.79167 4.05829L7.425 4.27496L10 1.66663Z'
                            stroke='currentColor'
                            strokeWidth='1.4'
                            strokeLinejoin='round'
                          />
                        </svg>
                      ) : null}
                      <span>{sellerStatusLabel}</span>
                    </span>

                    {inventorySummary.map((item) => (
                      <span key={item} className={styles.inlineStatGroup}>
                        <span className={styles.inlineDivider}></span>
                        <span className={styles.inlineStat}>{item}</span>
                      </span>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            {isSellerLoading ? (
              <aside className={styles.detailsPanel}>
                <span className={styles.detailsDivider}></span>
                <div className={styles.detailsGroup}>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabelSkeleton}></div>
                    <div className={styles.detailValueSkeleton}></div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabelSkeleton}></div>
                    <div className={styles.detailValueSkeleton}></div>
                  </div>
                </div>

                <span className={styles.detailsDivider}></span>
                <div className={styles.detailsGroup}>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabelSkeleton}></div>
                    <div className={styles.detailValueSkeleton}></div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabelSkeleton}></div>
                    <div className={styles.detailValueSkeleton}></div>
                  </div>
                </div>
              </aside>
            ) : seller ? (
              <aside className={styles.detailsPanel}>
                <span className={styles.detailsDivider}></span>
                <div className={styles.detailsGroup}>
                  {managerName ? (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Manager</span>
                      <span className={styles.detailValue}>{managerName}</span>
                    </div>
                  ) : null}

                  {sellerLocation ? (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Location</span>
                      <span className={styles.detailValue}>{sellerLocation}</span>
                    </div>
                  ) : null}
                </div>

                <span className={styles.detailsDivider}></span>
                <div className={styles.detailsGroup}>
                  {seller.email ? (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Email</span>
                      <a
                        href={`mailto:${seller.email}`}
                        className={styles.metaLink}
                      >
                        {seller.email}
                      </a>
                    </div>
                  ) : null}

                  {seller.phoneNumber ? (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Phone</span>
                      <a
                        href={`tel:${seller.phoneNumber}`}
                        className={styles.metaLink}
                      >
                        {seller.phoneNumber}
                      </a>
                    </div>
                  ) : null}
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>

      <Space height='32px' />

      {isLoading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <CardProductSkeleton key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <NoProductsFound />
      ) : (
        <>
          <CardSection
            cards={products}
            CardComponent={CardProduct}
            noPaddings
            overlayActive={isSellerPageLoading}
          />

          {totalPages > 1 && (
            <div className={styles.paginationWrap}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                noPaddings
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SellerProductsPublic;
