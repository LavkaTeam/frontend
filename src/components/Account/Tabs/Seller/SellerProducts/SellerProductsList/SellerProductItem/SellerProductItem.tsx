import type { Product } from '@/types/productCard';

import { EditProductIcon } from '@/components/ui/icons/EditProductIcon';

import styles from './SellerProductItem.module.css';

interface Props {
  product: Product;
  onEdit: (id: string) => void;
}

export const SellerProductItem = ({ product, onEdit }: Props) => {
  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return styles.statusActive;
      case 'HIDDEN':
        return styles.statusHidden;
      case 'UNDER_REVIEW':
        return styles.statusReview;
      case 'ARCHIVED':
        return styles.statusArchived;
      default:
        return styles.statusHidden;
    }
  };

  // Форматуємо UNDER_REVIEW -> under review
  const formatStatusText = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase();
  };

  const formattedPrice = `$${product.price.toFixed(2)}`;

  return (
    <div className={styles.itemCard}>
      <div className={styles.productCartGrid}>
        <div className={styles.imageWrapper}>
          <img
            src={product.mainImage?.url || '/placeholder-bottle.png'}
            alt={product.name}
            className={styles.productImg}
          />
        </div>

        <div className={styles.textGrid}>
          <span className={styles.subheading}>
            {product.name}, {product.volume}, {product.producer}
          </span>

          <span className={styles.category}>{product.category}</span>

          <div className={styles.priceGrid}>
            <span className={styles.priceText}>{formattedPrice}</span>

            <div
              className={`${styles.statusBadge} ${getStatusClass(product.status)}`}
            >
              <span className={styles.statusText}>
                {formatStatusText(product.status)}
              </span>
            </div>

            <button
              className={styles.editBtn}
              onClick={() => onEdit(product.id)}
              aria-label='Edit product'
            >
              <EditProductIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
