import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { OutlineHeart, SolidHeart } from '@/components/ui/icons/Heart';
import { ShoppingCart } from '@/components/ShoppingCart';
import type { Product } from '@/types/productCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addItem,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  updateItemQuantity,
} from '@/store/cartSlice';
import { toggleFavorite } from '@/store/favoritesSlice';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import styles from './CardProduct.module.css';

// --- 1. Pure Utility Functions (SOLID / DRY) ---

const getProductImageUrls = (card: Product): string[] => {
  const urls = [
    card.mainImage?.url,
    ...(card.images || []).map((img) => img.url),
  ].filter((url): url is string => Boolean(url));

  const uniqueUrls = Array.from(new Set(urls));
  return uniqueUrls.length > 0
    ? uniqueUrls
    : ['https://placehold.co/400?text=No+Image'];
};

const getPricing = (card: Product, quantityInCart: number) => {
  const isDiscountValid =
    typeof card.discountPrice === 'number' &&
    card.discountPrice > 0 &&
    card.discountPrice < card.price;
  const discountedPrice = isDiscountValid ? card.discountPrice : null;
  const basePrice = discountedPrice ?? card.price;

  const validWholesaleTiers = [...(card.wholesalePrices || [])]
    .filter((wp) => wp.minQuantity > 0 && wp.price > 0)
    .sort((a, b) => a.minQuantity - b.minQuantity);

  const wholesalePrices = validWholesaleTiers.map((wp) => wp.price);
  const fromPrice = Math.min(basePrice, ...wholesalePrices);
  const hasWholesalePriceRange =
    wholesalePrices.length > 0 &&
    new Set([basePrice, ...wholesalePrices].map((p) => p.toFixed(2))).size > 1;

  let currentUnitPrice = basePrice;
  for (const tier of validWholesaleTiers) {
    if (quantityInCart >= tier.minQuantity) {
      currentUnitPrice = Math.min(currentUnitPrice, tier.price);
    }
  }

  return {
    discountedPrice,
    fromPrice,
    currentUnitPrice,
    hasWholesalePriceRange,
  };
};

// --- 2. Isolated Custom Hooks (KISS / Single Responsibility) ---

const useMaxQuantityTooltip = () => {
  const [showMaxTooltip, setShowMaxTooltip] = useState(0);

  useEffect(() => {
    if (showMaxTooltip > 0) {
      const timer = window.setTimeout(() => setShowMaxTooltip(0), 2500);
      return () => window.clearTimeout(timer);
    }
  }, [showMaxTooltip]);

  const triggerMaxTooltip = () => setShowMaxTooltip((prev) => prev + 1);

  return { showMaxTooltip, triggerMaxTooltip };
};

const useImageCarousel = (imageUrls: string[], isHovered: boolean) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isHovered || imageUrls.length < 2) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((prev) => (prev + 1) % imageUrls.length);
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % imageUrls.length);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isHovered, imageUrls.length]);

  return activeIndex;
};

// --- 3. Main Component ---

type CardProductProps = {
  card: Product;
};

const CardProduct = ({ card }: CardProductProps) => {
  const dispatch = useAppDispatch();

  // Selectors
  const cartItems = useAppSelector((state) => state.cart);
  const cartItem = cartItems.find((item) => item.id === card.id);
  const isFavorite = useAppSelector((state) =>
    state.favorites.includes(card.id),
  );

  // Derived State
  const quantityInCart = cartItem?.quantity || 0;
  const minOrderQty = card.minimumOrderQuantity || 1;
  const isMaxQuantityReached = quantityInCart >= card.quantity;
  const hasMinOrderRule = minOrderQty > 1;

  const {
    discountedPrice,
    fromPrice,
    currentUnitPrice,
    hasWholesalePriceRange,
  } = useMemo(() => getPricing(card, quantityInCart), [card, quantityInCart]);

  const imageUrls = useMemo(() => getProductImageUrls(card), [card]);

  // Custom Hooks
  const [isImageHovered, setIsImageHovered] = useState(false);
  const activeImageIndex = useImageCarousel(imageUrls, isImageHovered);
  const { showMaxTooltip, triggerMaxTooltip } = useMaxQuantityTooltip();

  // Handlers
  const handleAddToCart = () => dispatch(addItem(card));
  const handleFavoriteClick = () => dispatch(toggleFavorite(card.id));

  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (cartItem && cartItem.quantity < card.quantity) {
      dispatch(increaseQuantity({ id: card.id }));
      if (cartItem.quantity + 1 >= card.quantity) triggerMaxTooltip();
    } else {
      triggerMaxTooltip();
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity <= minOrderQty) {
      dispatch(removeItem({ id: card.id }));
    } else {
      dispatch(decreaseQuantity({ id: card.id }));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = minOrderQty;

    if (value >= card.quantity) {
      value = card.quantity;
      triggerMaxTooltip();
    }
    if (value < minOrderQty) value = minOrderQty;

    dispatch(updateItemQuantity({ id: card.id, quantity: value }));
  };

  return (
    <article className={styles.cardProduct}>
      <div className={styles.badgesWrapper}>
        {card.mainCategory === 'BESTSELLERS' && <Badge type='bestseller' />}
        {discountedPrice !== null && <Badge type='sale' />}
      </div>

      <div className={styles.favoriteIcon} onClick={handleFavoriteClick}>
        {isFavorite ? <SolidHeart /> : <OutlineHeart />}
      </div>

      <div
        className={styles.cardLinkArea}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <Link to={`/product/${card.id}`} className={styles.imageLink}>
          <div className={styles.cardImageWrapper}>
            {imageUrls.map((url, index) => (
              <img
                key={`${card.id}-image-${index}`}
                src={url}
                alt={card.name}
                className={`${styles.cardImage} ${
                  index === activeImageIndex
                    ? styles.imageVisible
                    : styles.imageHidden
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        </Link>

        <div className={styles.cardProductInfo}>
          <div className={styles.cardDetailsTop}>
            <div className={styles.cardInStock}>
              {card.quantity > 0 ? (
                <span className={styles.inStock}>In stock</span>
              ) : (
                <span className={styles.soldOut}>Sold Out</span>
              )}
              <span className={styles.sku}>SKU. {card.sku}</span>
            </div>

            <div className={styles.cardProductMainBlock}>
              <div className={styles.headingAndSub}>
                <Link to={`/product/${card.id}`} className={styles.titleLink}>
                  <span className={styles.heading}>{card.name}</span>
                </Link>

                {(card.volume || card.alcohol) && (
                  <span className={styles.subHeading}>
                    {card.volume} L / {card.alcohol}% ABV
                  </span>
                )}

                {(card.producer || card.countryOfOrigin) && (
                  <span className={styles.subHeading}>
                    {card.producer || 'Unknown'} /{' '}
                    {card.countryOfOrigin || 'Unknown'}
                  </span>
                )}
              </div>

              <div className={styles.ratingBlock}>
                <RatingStars rating={card.averageRating || 0} max={5} size={16} />
                <span className={styles.ratingValue}>
                  {card.averageRating ? card.averageRating.toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.cardDetailsBottom}>
            <span className={styles.divider}></span>

            <div className={styles.priceRow}>
              <span className={styles.priceText}>
                {hasWholesalePriceRange && (
                  <span className={styles.priceFromLabel}>From </span>
                )}
                ${fromPrice.toFixed(2)}
              </span>

              {discountedPrice !== null && (
                <span className={styles.oldPriceText}>
                  ${card.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cartButtonWrapper}>
        {hasMinOrderRule && (
          <span className={styles.minOrderHint}>
            Min. order: {minOrderQty} pcs
          </span>
        )}
        {!cartItem ? (
          <div className={styles.actionStateWrapper}>
            <Button
              disabled={card.quantity <= 0}
              onClick={handleAddToCart}
              icon={<ShoppingCart />}
            >
              Add to cart
            </Button>
          </div>
        ) : (
          <div className={styles.addedStateWrapper}>
            <div className={styles.counterRow}>
              <span className={styles.unitPrice}>
                ${currentUnitPrice.toFixed(2)}
              </span>

              <div className={styles.quantityWrapper}>
                <div className={styles.quantityBlock}>
                  <button
                    onClick={handleDecreaseQuantity}
                    className={styles.quantityBtn}
                    title={
                      hasMinOrderRule && quantityInCart <= minOrderQty
                        ? 'Remove from cart'
                        : 'Decrease quantity'
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
                    max={card.quantity}
                  />

                  <button
                    onClick={handleIncreaseQuantity}
                    className={`${styles.quantityBtn} ${isMaxQuantityReached ? styles.quantityBtnDisabled : ''}`}
                  >
                    +
                  </button>
                </div>

                {showMaxTooltip > 0 && (
                  <span key={showMaxTooltip} className={styles.stockTooltip}>
                    Max available: {card.quantity} pcs
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
    </article>
  );
};

export { CardProduct };
