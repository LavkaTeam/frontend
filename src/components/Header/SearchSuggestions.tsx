import { Link } from 'react-router-dom';
import type { ProductSuggestion } from '@/types/api';
import type { ProductImage } from '@/types/productCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFromSearchHistory, clearSearchHistory } from '@/store/searchHistorySlice';
import styles from './SearchSuggestions.module.css';

interface SearchSuggestionsProps {
  suggestions: ProductSuggestion[];
  isLoading: boolean;
  isVisible: boolean;
  onItemClick: () => void;
  onViewAllClick: () => void;
  searchValue: string;
  onSearch: (query: string) => void;
}

const POPULAR_SEARCHES = [
  'Red Wine',
  'Whisky',
  'Vodka',
  'Champagne',
  'Gin',
  'Beer',
  'Tequila',
  'Prosecco',
];

const SearchSuggestions = ({
  suggestions,
  isLoading,
  isVisible,
  onItemClick,
  onViewAllClick,
  searchValue,
  onSearch,
}: SearchSuggestionsProps) => {
  const dispatch = useAppDispatch();
  const history = useAppSelector((state) => state.searchHistory.items);

  if (!isVisible) return null;

  const showHistory = searchValue.length < 2 && history.length > 0;

  const getPricing = (item: ProductSuggestion) => {
    const isDiscountValid =
      typeof item.discountPrice === 'number' &&
      item.discountPrice > 0 &&
      item.discountPrice < item.price;
    const discountedPrice = isDiscountValid ? item.discountPrice : null;
    const basePrice = discountedPrice ?? item.price;

    const validWholesaleTiers = [...(item.wholesalePrices || [])]
      .filter((wp) => wp.minQuantity > 0 && wp.price > 0)
      .sort((a, b) => a.minQuantity - b.minQuantity);

    const wholesalePrices = validWholesaleTiers.map((wp) => wp.price);
    const fromPrice = Math.min(basePrice, ...wholesalePrices);
    const hasWholesalePriceRange =
      wholesalePrices.length > 0 &&
      new Set([basePrice, ...wholesalePrices].map((p) => p.toFixed(2))).size >
        1;

    return {
      fromPrice,
      hasWholesalePriceRange,
    };
  };

  const getImageUrl = (image: string | ProductImage) => {
    if (typeof image === 'string') return image;
    return image?.url || 'https://placehold.co/100?text=No+Image';
  };

  return (
    <div className={styles.suggestionsWrapper}>
      <div className={styles.suggestionsList}>
        {isLoading ? (
          <div className={styles.loading}>
            <span>Searching...</span>
          </div>
        ) : showHistory ? (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <span className={styles.historyTitle}>Recent Searches</span>
              <button
                type='button'
                className={styles.clearHistoryBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(clearSearchHistory());
                }}
              >
                Clear All
              </button>
            </div>
            <div className={styles.historyList}>
              {history.map((item) => (
                <div
                  key={item}
                  className={`${styles.historyItem} ${item === searchValue ? styles.active : ''}`}
                  onClick={() => {
                    onSearch(item);
                    onItemClick();
                  }}
                >
                  <span className={styles.historyText}>{item}</span>
                  {item === searchValue && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                  <button
                    type='button'
                    className={styles.removeHistoryItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromSearchHistory(item));
                    }}
                    aria-label="Remove from history"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <>
            {suggestions.map((item) => {
              const { fromPrice, hasWholesalePriceRange } = getPricing(item);
              const imageUrl = getImageUrl(item.mainImage);

              return (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className={styles.suggestionItem}
                  onClick={onItemClick}
                >
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <div className={styles.productHeader}>
                      <div className={styles.nameBlock}>
                        <h4 className={styles.productName}>{item.name}</h4>
                        <p className={styles.productProducer}>
                          {item.producer}{' '}
                          {item.volume ? `· ${item.volume} L` : ''}{' '}
                          {item.alcohol ? `· ${item.alcohol}% ABV` : ''}
                        </p>
                      </div>
                      <div className={styles.priceSection}>
                        <div className={styles.priceRow}>
                          {hasWholesalePriceRange && (
                            <span className={styles.priceFromLabel}>From </span>
                          )}
                          <span className={styles.currentPrice}>
                            ${fromPrice.toFixed(2)}
                          </span>
                        </div>
                        {item.minimumOrderQuantity > 1 && (
                          <span className={styles.minOrderTag}>
                            Min. order: {item.minimumOrderQuantity} pcs
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.productMeta}>
                      {item.quantity > 0 ? (
                        <span className={styles.inStock}>In stock</span>
                      ) : (
                        <span className={styles.soldOut}>Sold Out</span>
                      )}
                      <span className={styles.divider}>|</span>
                      <span className={styles.sku}>SKU. {item.sku}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
            <button className={styles.viewAllBtn} onClick={onViewAllClick}>
              View all results
            </button>
          </>
        ) : searchValue.length >= 2 ? (
          <div className={styles.noResults}>No products found</div>
        ) : null}

        {/* Popular Searches Section */}
        {!isLoading && (
          <div className={styles.popularSection}>
            <h4 className={styles.sectionTitle}>Popular Searches</h4>
            <div className={styles.popularTags}>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type='button'
                  className={styles.tag}
                  onClick={() => {
                    onSearch(term);
                    onItemClick();
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { SearchSuggestions };
