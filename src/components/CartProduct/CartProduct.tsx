import { Link } from 'react-router-dom';
import type { ProductImage } from '@/types/productCard';

import { DeleteIcon } from '../ui/icons/DeleteIcon';
import { useCartActions } from '@/hooks/useCartActions';
import { resolvePricing } from '@/utils/pricing';
import type { WholesalePrice } from '@/types/productCard';

import styles from './CartProduct.module.css';

type CartProductProps = {
  card: {
    id: string;
    name: string;
    price: number;
    mainImage?: ProductImage;
    producer: string;
    volume?: number;
    minimumOrderQuantity?: number;
    sku?: string;
    barcode?: string;
    country?: string;
    alcohol?: number;
    discountPrice?: number;
    wholesalePrices?: WholesalePrice[];
    taxRate?: number;
  };
  displayQuantity: number;
  serverQuantity: number;
};

const CartProduct = ({
  card,
  displayQuantity,
  serverQuantity,
}: CartProductProps) => {
  const { updateQuantity, removeItem, isRemovingItem } = useCartActions();
  const minOrderQty = card.minimumOrderQuantity || 1;

  const { currentUnitPrice } = resolvePricing(card, displayQuantity);
  const normalizedTaxRate =
    typeof card.taxRate === 'number'
      ? card.taxRate > 1
        ? card.taxRate / 100
        : card.taxRate
      : 0;
  const totalItemPrice = (serverQuantity * currentUnitPrice).toFixed(2);
  const unitTax = (currentUnitPrice * normalizedTaxRate).toFixed(2);
  const totalTax = (serverQuantity * currentUnitPrice * normalizedTaxRate).toFixed(2);
  const metadataItems = [
    card.sku ? `SKU: ${card.sku}` : null,
    card.barcode ? `Barcode: ${card.barcode}` : null,
    card.country ? card.country : null,
    typeof card.alcohol === 'number' ? `${card.alcohol}% ABV` : null,
  ].filter(Boolean) as string[];
  const metadataRows: string[][] = [];

  for (let index = 0; index < metadataItems.length; index += 2) {
    metadataRows.push(metadataItems.slice(index, index + 2));
  }

  const imageUrl =
    card.mainImage?.url || 'https://placehold.co/400?text=No+Image';

  const isRemoving = isRemovingItem(card.id);

  return (
    <div className={styles.card}>
      <div className={styles.cardWrapper}>
        <div className={styles.cardContent}>
          <Link to={`/product/${card.id}`} className={styles.cardImg}>
            <img src={imageUrl} alt={card.name} />
          </Link>
          <div className={styles.cardInfo}>
            <div className={styles.cardTitle}>
              <Link to={`/product/${card.id}`} className={styles.cardTitleLink}>
                {card.name},{card.volume && ` ${card.volume} L`},{' '}
                {card.producer}
              </Link>
            </div>
            {metadataRows.length > 0 ? (
              <div
                className={styles.cardMetadata}
                aria-label='Product metadata'
              >
                {metadataRows.map((row, rowIndex) => (
                  <div
                    key={`metadata-row-${rowIndex}`}
                    className={styles.cardMetadataRow}
                  >
                    {row.map((item, index) => (
                      <span
                        key={`${item}-${index}`}
                        className={styles.cardMetadataItem}
                      >
                        {item}
                        {index < row.length - 1 ? (
                          <span
                            className={styles.cardMetadataDot}
                            aria-hidden='true'
                          />
                        ) : null}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className={styles.cardPriceWrap}>
            <span className={styles.cardPrice}>
              ${currentUnitPrice.toFixed(2)}
            </span>
            <span className={styles.cardTaxHint}>+ tax ${unitTax} / item</span>
          </div>
          <div className={styles.quantity}>
            <button
              onClick={() => updateQuantity(card.id, displayQuantity - 1)}
              className={styles.quantityBtn}
              disabled={isRemoving || displayQuantity <= minOrderQty}
            >
              -
            </button>
            <span className={styles.cardQuantity}>{displayQuantity}</span>
            <button
              onClick={() => updateQuantity(card.id, displayQuantity + 1)}
              className={styles.quantityBtn}
              disabled={isRemoving}
            >
              +
            </button>
          </div>
          <div className={styles.cardTotalWrap}>
            <span className={styles.cardTotalPrice}>${totalItemPrice}</span>
            <span className={styles.cardTaxHint}>+ tax ${totalTax}</span>
          </div>
          <button
            onClick={() => removeItem(card.id)}
            className={styles.deleteButton}
            disabled={isRemoving}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export { CartProduct };
