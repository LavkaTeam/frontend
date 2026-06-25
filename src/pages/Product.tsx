import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToHistory } from '@/store/viewingHistorySlice';
import { toggleFavorite } from '@/store/favoritesSlice';
import { useCartActions } from '@/hooks/useCartActions';
import { useProduct } from '@/hooks/useProduct';
import { useSearchProducts } from '@/hooks/useSearchProducts';

import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';
import { SubHeading } from '@/components/ui/SubHeading';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from '@/components/ShoppingCart';
import { CardSection } from '@/components/CardSection';
import { CardProduct } from '@/components/CardProduct';
import { CardProductSkeleton } from '@/components/CardProduct';
import { OutlineHeart, SolidHeart } from '@/components/ui/icons/Heart';
import { ProductGallery } from '@/components/ProductGallery';
import { ArrowButton } from '@/components/ui/icons/ArrowButton';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { ProductPageSkeleton } from '@/components/ProductPageSkeleton/ProductPageSkeleton';
import { resolvePricing } from '@/utils/pricing';
import NotFound from './NotFound';

import styles from './Product.module.css';

const formatEnumLabel = (value: string | undefined) => {
  if (!value) return 'N/A';

  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatNumberValue = (value: number | undefined, suffix = '') => {
  if (typeof value !== 'number') return 'N/A';
  return `${value}${suffix}`;
};

interface WholesaleTier {
  minQuantity: number;
  price: number;
}

interface WholesaleRange {
  price: number;
  label: string;
}

const DRAWER_OPEN_DURATION_MS = 400;
const DRAWER_SCROLL_DURATION_MS = DRAWER_OPEN_DURATION_MS;
const DRAWER_HIGHLIGHT_DELAY_MS = 250;
const DRAWER_HIGHLIGHT_DURATION_MS = 1000;

const smoothScrollTo = (
  container: HTMLDivElement,
  targetTop: number,
  duration: number,
) => {
  const startTop = container.scrollTop;
  const distance = targetTop - startTop;
  const startTime = performance.now();

  const easeInOutCubic = (progress: number) => {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  };

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const nextTop = startTop + distance * easeInOutCubic(progress);

    container.scrollTop = nextTop;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

const buildWholesaleRanges = (
  basePrice: number,
  minimumOrderQuantity: number,
  tiers: WholesaleTier[],
) => {
  const effectiveMinQuantity = Math.max(1, minimumOrderQuantity);
  const priceBreaks = new Map<number, number>([
    [effectiveMinQuantity, basePrice],
  ]);

  tiers
    .filter((tier) => tier.minQuantity > 0 && tier.price > 0)
    .sort(
      (firstTier, secondTier) => firstTier.minQuantity - secondTier.minQuantity,
    )
    .forEach((tier) => {
      priceBreaks.set(
        Math.max(tier.minQuantity, effectiveMinQuantity),
        tier.price,
      );
    });

  const normalizedBreaks = [...priceBreaks.entries()]
    .sort((firstBreak, secondBreak) => firstBreak[0] - secondBreak[0])
    .reduce<Array<{ minQuantity: number; price: number }>>(
      (accumulator, [minQuantity, price]) => {
        const lastBreak = accumulator[accumulator.length - 1];

        if (lastBreak && lastBreak.price === price) {
          return accumulator;
        }

        accumulator.push({ minQuantity, price });
        return accumulator;
      },
      [],
    );

  return normalizedBreaks.map<WholesaleRange>((tier, index) => {
    const nextTier = normalizedBreaks[index + 1];
    const rangeEnd = nextTier ? nextTier.minQuantity - 1 : null;
    const quantityLabel = nextTier
      ? rangeEnd !== null && rangeEnd > tier.minQuantity
        ? `${tier.minQuantity}-${rangeEnd}`
        : `${tier.minQuantity}`
      : `${tier.minQuantity}+`;

    return {
      price: tier.price,
      label: `${quantityLabel} pcs`,
    };
  });
};

const Product = () => {
  const dispatch = useAppDispatch();
  const { productId } = useParams();

  const { product, isLoading, error } = useProduct(productId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTarget, setDrawerTarget] = useState<
    'specifications' | 'description'
  >('specifications');
  const [highlightedDrawerSection, setHighlightedDrawerSection] = useState<
    'specifications' | 'description' | null
  >(null);
  const drawerContentRef = useRef<HTMLDivElement | null>(null);
  const specificationsSectionRef = useRef<HTMLDivElement | null>(null);
  const descriptionSectionRef = useRef<HTMLDivElement | null>(null);
  const descriptionPreviewRef = useRef<HTMLDivElement | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] =
    useState(false);

  const {
    addItem,
    updateQuantity,
    getCartItemQuantity,
    isAddingItem,
    isRemovingItem,
  } = useCartActions();
  const quantityInCart = productId ? getCartItemQuantity(productId) : 0;
  const isFavorite = useAppSelector((state) =>
    productId ? state.favorites.includes(productId) : false,
  );

  const { products: relatedProducts, isLoading: isRelatedLoading } =
    useSearchProducts(
      {
        category: product?.category,
        size: 8,
        sort: ['salesCount,desc'],
      },
      { skipFilters: true },
    );

  useEffect(() => {
    if (productId && product) {
      dispatch(addToHistory(productId));
    }
  }, [productId, product, dispatch]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const scrollContainer = drawerContentRef.current;
    const targetNode =
      drawerTarget === 'description'
        ? descriptionSectionRef.current
        : specificationsSectionRef.current;

    if (!scrollContainer || !targetNode) return;

    const drawerHeaderHeight =
      scrollContainer.previousElementSibling instanceof HTMLElement
        ? scrollContainer.previousElementSibling.offsetHeight
        : 0;
    const targetTop = Math.max(targetNode.offsetTop - drawerHeaderHeight - 24, 0);

    smoothScrollTo(scrollContainer, targetTop, DRAWER_SCROLL_DURATION_MS);

    if (highlightTimeoutRef.current) {
      window.clearTimeout(highlightTimeoutRef.current);
    }

    window.setTimeout(() => {
      setHighlightedDrawerSection(drawerTarget);

      highlightTimeoutRef.current = window.setTimeout(() => {
        setHighlightedDrawerSection(null);
      }, DRAWER_HIGHLIGHT_DURATION_MS);
    }, DRAWER_OPEN_DURATION_MS + DRAWER_HIGHLIGHT_DELAY_MS);
  }, [drawerTarget, isDrawerOpen]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const checkDescriptionOverflow = () => {
      const descriptionNode = descriptionPreviewRef.current;
      if (!descriptionNode) return;

      setIsDescriptionOverflowing(
        descriptionNode.scrollHeight > descriptionNode.clientHeight + 1,
      );
    };

    checkDescriptionOverflow();
    window.addEventListener('resize', checkDescriptionOverflow);

    return () => {
      window.removeEventListener('resize', checkDescriptionOverflow);
    };
  }, [product?.description]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <main className='container'>
        <ProductPageSkeleton />
      </main>
    );
  }

  if (error || !product) {
    return <NotFound />;
  }

  const minOrderQty = Math.max(
    1,
    Math.min(product.minimumOrderQuantity || 1, Math.max(product.quantity, 1)),
  );
  const isInStock = Boolean(product.inStock && product.quantity > 0);
  const { discountedPrice, basePrice, currentUnitPrice } = resolvePricing(
    product,
    quantityInCart,
  );
  const sortedWholesalePrices = [...(product.wholesalePrices || [])]
    .filter((tier) => tier.minQuantity > 0 && tier.price > 0)
    .sort((a, b) => a.minQuantity - b.minQuantity);
  const wholesaleRanges = buildWholesaleRanges(
    basePrice,
    minOrderQty,
    sortedWholesalePrices,
  );
  const hasWholesalePrices =
    sortedWholesalePrices.length > 0 &&
    (wholesaleRanges.length > 1 || wholesaleRanges[0]?.price !== basePrice);
  const pricePoints = wholesaleRanges.map((tier) => tier.price);
  const fromPrice = hasWholesalePrices
    ? Math.min(basePrice, ...pricePoints)
    : basePrice;
  const hasWholesalePriceRange =
    hasWholesalePrices &&
    new Set([basePrice, ...pricePoints].map((price) => price.toFixed(2))).size >
      1;

  const filteredRelatedProducts = relatedProducts
    .filter((item) => item.category === product.category)
    .filter((item) => item.id !== product.id)
    .slice(0, 8);

  const visibleSpecs = [
    { title: 'Brand', value: product.producer || 'N/A' },
    { title: 'Alcohol', value: formatNumberValue(product.alcohol, '%') },
    { title: 'Country', value: product.countryOfOrigin || 'N/A' },
    { title: 'Volume', value: formatNumberValue(product.volume, ' L') },
  ];

  const fullSpecifications = [
    { label: 'SKU', value: product.sku || 'N/A' },
    { label: 'Country of origin', value: product.countryOfOrigin || 'N/A' },
    { label: 'Main category', value: formatEnumLabel(product.mainCategory) },
    { label: 'Category', value: formatEnumLabel(product.category) },
    { label: 'Subcategory', value: formatEnumLabel(product.subcategory) },
    { label: 'Volume', value: formatNumberValue(product.volume, ' L') },
    { label: 'Alcohol', value: formatNumberValue(product.alcohol, '%') },
    ...(minOrderQty > 1
      ? [{ label: 'Minimum order quantity', value: `${minOrderQty} pcs` }]
      : []),
    { label: 'Material', value: product.material || 'N/A' },
    { label: 'Barcode', value: product.barcode || 'N/A' },
    { label: 'Weight', value: formatNumberValue(product.weight, ' kg') },
    { label: 'Tax rate', value: formatNumberValue(product.taxRate, '%') },
    { label: 'Dimensions', value: product.dimensions || 'N/A' },
    { label: 'Seller company', value: product.seller.companyName || 'N/A' },
    { label: 'Seller email', value: product.seller.email || 'N/A' },
    { label: 'Seller phone', value: product.seller.phoneNumber || 'N/A' },
  ];

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = minOrderQty;
    if (value < minOrderQty) value = minOrderQty;
    if (value > product.quantity) value = product.quantity;

    updateQuantity(product.id, value);
  };

  const handleOpenDrawer = (
    target: 'specifications' | 'description' = 'specifications',
  ) => {
    setDrawerTarget(target);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const isMaxQuantityReached = quantityInCart >= product.quantity;

  return (
    <main className='container'>
      <div
        className={`${styles.drawerOverlay} ${isDrawerOpen ? styles.open : ''}`}
        onClick={handleCloseDrawer}
      />
      <div className={`${styles.drawer} ${isDrawerOpen ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>
          <HeadingH3>Product Specification</HeadingH3>
          <button
            type='button'
            className={styles.closeDrawerBtn}
            onClick={handleCloseDrawer}
          >
            ×
          </button>
        </div>

        <div className={styles.drawerContent} ref={drawerContentRef}>
          <div
            className={`${styles.drawerSection} ${
              highlightedDrawerSection === 'specifications'
                ? styles.drawerSectionHighlighted
                : ''
            }`}
            ref={specificationsSectionRef}
          >
            <h6 className={styles.drawerTitle}>Specifications</h6>
            <div className={styles.drawerSpecTable}>
              {fullSpecifications.map((item) => (
                <div key={item.label} className={styles.drawerSpecRow}>
                  <span className={styles.drawerSpecLabel}>{item.label}</span>
                  <span className={styles.drawerSpecValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {hasWholesalePrices && (
            <div className={styles.drawerSection}>
              <h6 className={styles.drawerTitle}>Wholesale Prices</h6>
              <div className={styles.wholesaleList}>
                {wholesaleRanges.map((tier) => (
                  <div key={tier.label} className={styles.wholesaleItem}>
                    <span className={styles.wholesaleRange}>{tier.label}</span>
                    <span className={styles.wholesalePrice}>
                      ${tier.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className={`${styles.drawerSection} ${
              highlightedDrawerSection === 'description'
                ? styles.drawerSectionHighlighted
                : ''
            }`}
            ref={descriptionSectionRef}
          >
            <h6 className={styles.drawerTitle}>Description</h6>
            <p className={styles.drawerDescription}>
              {product.description || 'No description available.'}
            </p>
          </div>

          {product.tags.length > 0 && (
            <div className={styles.drawerSection}>
              <h6 className={styles.drawerTitle}>Tags</h6>
              <div className={styles.tagsRow}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tagChip}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.pageTop}>
        <div className={styles.breadcrumbs}>
          <Link to='/products' className={styles.breadcrumbLink}>
            Catalog
          </Link>
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <Link
            to={`/products?category=${product.category}`}
            className={styles.breadcrumbLink}
          >
            {formatEnumLabel(product.category)}
          </Link>
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <Link
            to={`/products?category=${product.category}&subcategory=${product.subcategory}`}
            className={styles.breadcrumbLink}
          >
            {formatEnumLabel(product.subcategory)}
          </Link>
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>
      </div>

      <div className={styles.productPage}>
        <div className={styles.imageBlock}>
          <div className={styles.imageBlockInner}>
            <div className={styles.imageBadges}>
              {product.mainCategory === 'BESTSELLERS' && (
                <Badge type='bestseller' />
              )}
              {discountedPrice !== null && <Badge type='sale' />}
            </div>
            <ProductGallery
              mainImage={product.mainImage}
              additionalImages={product.images}
              altText={product.name}
            />
          </div>
        </div>

        <div className={styles.contentBlock}>
          <HeadingH3>{product.name}</HeadingH3>
          <Space height='18px' />

          <div className={styles.inStockInfo}>
            <div className={styles.stockState}>
              {isInStock ? (
                <>
                  <span className={styles.spanInStock}></span>
                  <p className={styles.inStock}>In Stock</p>
                </>
              ) : (
                <>
                  <span className={styles.spanSoldOut}></span>
                  <p className={styles.soldOut}>Sold Out</p>
                </>
              )}
            </div>

            <span className={styles.skuText}>SKU: {product.sku || 'N/A'}</span>
          </div>

          <Space height='10px' />

          <div className={styles.ratingRow}>
            <RatingStars rating={product.averageRating || 0} max={5} />
            <span className={styles.ratingValue}>
              {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
            </span>
            <span className={styles.ratingMeta}>({product.reviewsCount})</span>
          </div>

          <Space height='14px' />

          <div className={styles.priceBlock}>
            <div className={styles.priceRow}>
              {hasWholesalePriceRange && (
                <span className={styles.priceFromLabel}>From</span>
              )}
              <span className={styles.priceValue}>${fromPrice.toFixed(2)}</span>
              {discountedPrice !== null && (
                <span className={styles.oldPrice}>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <Space height='24px' />

          <div className={styles.productInfo}>
            <div className={styles.specGrid}>
              <div className={styles.specColumn}>
                <div>
                  <SubHeading size='medium' color='primary'>
                    {visibleSpecs[0].title}:
                  </SubHeading>
                  <SubHeading size='medium' color='secondary'>
                    {visibleSpecs[0].value}
                  </SubHeading>
                </div>
                <Space height='24px' />
                <div>
                  <SubHeading size='medium' color='primary'>
                    {visibleSpecs[1].title}:
                  </SubHeading>
                  <SubHeading size='medium' color='secondary'>
                    {visibleSpecs[1].value}
                  </SubHeading>
                </div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.specColumn}>
                <div>
                  <SubHeading size='medium' color='primary'>
                    {visibleSpecs[2].title}:
                  </SubHeading>
                  <SubHeading size='medium' color='secondary'>
                    {visibleSpecs[2].value}
                  </SubHeading>
                </div>
                <Space height='24px' />
                <div>
                  <SubHeading size='medium' color='primary'>
                    {visibleSpecs[3].title}:
                  </SubHeading>
                  <SubHeading size='medium' color='secondary'>
                    {visibleSpecs[3].value}
                  </SubHeading>
                </div>

                <div className={styles.specColumnFooter}>
                  <button
                    type='button'
                    className={styles.specButton}
                    onClick={() => handleOpenDrawer('specifications')}
                  >
                    <span>View all</span>
                    <span className={styles.specButtonArrow}>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {hasWholesalePrices && (
            <>
              <Space height='20px' />
              <div className={styles.wholesaleBlock}>
                <h6 className={styles.h6}>Wholesale Prices</h6>
                <div className={styles.wholesaleList}>
                  {wholesaleRanges.map((tier) => (
                    <div key={tier.label} className={styles.wholesaleItem}>
                      <span className={styles.wholesaleRange}>
                        {tier.label}
                      </span>
                      <span className={styles.wholesalePrice}>
                        ${tier.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className={styles.actions}>
            <div className={styles.actionButton}>
              {minOrderQty > 1 && (
                <span className={styles.minimumOrderLabel}>
                  Min. order: {minOrderQty} pcs
                </span>
              )}
              {quantityInCart === 0 ? (
                <Button
                  onClick={() => addItem(product, Math.max(1, minOrderQty))}
                  icon={<ShoppingCart />}
                  disabled={!isInStock}
                  isLoading={isAddingItem(product.id)}
                >
                  Add to cart
                </Button>
              ) : (
                <div className={styles.addedStateWrapper}>
                  <div className={styles.counterRow}>
                    <span className={styles.unitPrice}>
                      ${currentUnitPrice.toFixed(2)}
                    </span>

                    <div className={styles.quantityWrapper}>
                      <div className={styles.quantityBlock}>
                        <button
                          onClick={() => {
                            if (quantityInCart > minOrderQty) {
                              updateQuantity(product.id, quantityInCart - 1);
                            }
                          }}
                          className={styles.quantityBtn}
                          disabled={
                            isRemovingItem(product.id) ||
                            quantityInCart <= minOrderQty
                          }
                        >
                          -
                        </button>

                        <input
                          type='number'
                          className={styles.quantityInput}
                          value={quantityInCart}
                          onChange={handleQuantityChange}
                          min={minOrderQty}
                          max={product.quantity}
                          disabled={isRemovingItem(product.id)}
                        />

                        <button
                          onClick={() => {
                            if (quantityInCart > 0 && quantityInCart < product.quantity) {
                              updateQuantity(product.id, quantityInCart + 1);
                            }
                          }}
                          className={styles.quantityBtn}
                          disabled={isMaxQuantityReached || isRemovingItem(product.id)}
                        >
                          +
                        </button>
                      </div>

                      {isMaxQuantityReached && (
                        <span className={styles.stockMessage}>
                          Max available: {product.quantity}
                        </span>
                      )}
                    </div>

                    <span className={styles.totalPrice}>
                      ${(currentUnitPrice * quantityInCart).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div
              className={styles.favoritesBlock}
              onClick={() => dispatch(toggleFavorite(product.id))}
            >
              {isFavorite ? <SolidHeart /> : <OutlineHeart />}
              <span className={styles.favorites}>Favorites</span>
            </div>
          </div>

          <Space height='32px' />
          <div>
            <h6 className={styles.h6}>Product Description</h6>
            <div
              className={styles.descriptionWrapper}
              ref={descriptionPreviewRef}
            >
              <p className={styles.descriptionText}>
                {product.description || 'No description available.'}
              </p>

              {isDescriptionOverflowing && (
                <button
                  className={styles.readMoreBtn}
                  onClick={() => handleOpenDrawer('description')}
                >
                  Read more
                </button>
              )}
            </div>
          </div>

          <Space height='32px' />
          <div className={styles.border}></div>
          <Space height='26px' />

          <h6 className={styles.h6}>Seller of the product</h6>
          <Space height='20px' />

          <div className={styles.sellerRow}>
            <div className={styles.sellerInfo}>
              <div className={styles.sellerText}>
                <div className={styles.contactItem}>
                  <SubHeading size='medium' color='primary'>
                    Company Name:
                  </SubHeading>
                  <SubHeading size='medium' color='secondary'>
                    {product.seller.companyName || 'N/A'}
                  </SubHeading>
                </div>

                <div className={styles.contactItem}>
                  <SubHeading size='medium' color='primary'>
                    Email:
                  </SubHeading>
                  <SubHeading size='medium' color='secondary'>
                    {product.seller.email || 'N/A'}
                  </SubHeading>
                </div>

                <div className={styles.contactItem}>
                  <SubHeading size='medium' color='primary'>
                    Phone:
                  </SubHeading>
                  <SubHeading size='medium' color='secondary'>
                    {product.seller.phoneNumber || 'N/A'}
                  </SubHeading>
                </div>
              </div>
            </div>

            <div className={styles.sellerAside}>
              {product.seller.logoUrl ? (
                <div className={styles.sellerLogoWrap}>
                  <img
                    src={product.seller.logoUrl}
                    alt={product.seller.companyName || 'Seller logo'}
                    className={styles.sellerLogo}
                  />
                </div>
              ) : null}

              <Link
                to={`/sellerProducts/${product.seller.id}`}
                className={styles.sellerLinkWrapper}
              >
                <span className={styles.sellerLinkText}>
                  View all seller&apos;s collections
                </span>
                <div className={styles.sellerArrow}>
                  <ArrowButton direction='right' variant='minimal' />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Space height='80px' />

      <div className={styles.relatedProductsSection}>
        <div>
          <HeadingH3>Related products</HeadingH3>
          <Space height='32px' />
          <div className={styles.relatedSectionWrapper}>
            {isRelatedLoading ? (
              <div className={styles.relatedSkeletonGrid}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <CardProductSkeleton key={index} />
                ))}
              </div>
            ) : (
              <CardSection
                cards={filteredRelatedProducts}
                CardComponent={CardProduct}
                withSlider={filteredRelatedProducts.length > 4}
                noPaddings
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Product;
