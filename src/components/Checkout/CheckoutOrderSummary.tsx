import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import type { SellerGroup } from './checkoutTypes';
import type { NormalizedCartItem } from './checkoutTypes';
import { formatCurrency, formatWeight, getItemTax, getItemTotal, getItemUnitPrice } from './checkoutUtils';
import styles from '@/pages/Checkout.module.css';

type CheckoutOrderSummaryProps = {
  sellerGroups: SellerGroup[];
  hasMultipleSellers: boolean;
  cartSummary: {
    subtotal: number;
    totalItems: number;
    totalWeight?: number;
    totalTax?: number;
    grandTotal: number;
  };
  canPlaceOrder: boolean;
  isSubmitting: boolean;
  onPlaceOrder: () => void;
};

const SummaryItem = ({ item, sellerId }: { item: NormalizedCartItem; sellerId: string }) => {
  const productLink = `/product/${item.productId}`;

  return (
    <div key={`${sellerId}-${item.productId}`} className={styles.summaryItem}>
      <Link to={productLink} className={styles.productImageLink} aria-label={`Open ${item.name || 'product'}`}>
        <div className={styles.productImage}>
          {item.mainImage ? <img src={item.mainImage} alt={item.name || 'Product'} /> : <span>No image</span>}
        </div>
      </Link>
      <div className={styles.productMeta}>
        <Link to={productLink} className={styles.productNameLink}>
          <p className={styles.productName}>{item.name || 'Product'}</p>
        </Link>
        <span>
          {item.requestedQuantity} x {formatCurrency(getItemUnitPrice(item))}
        </span>
      </div>
      <div className={styles.productPriceBlock}>
        <strong className={styles.productPrice}>{formatCurrency(getItemTotal(item))}</strong>
        <span className={styles.productTax}>incl. {formatCurrency(getItemTax(item))} tax</span>
      </div>
    </div>
  );
};

const CheckoutOrderSummary = ({
  sellerGroups,
  hasMultipleSellers,
  cartSummary,
  canPlaceOrder,
  isSubmitting,
  onPlaceOrder,
}: CheckoutOrderSummaryProps) => (
  <aside className={styles.sidebar}>
    <div className={styles.sidebarCard}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>Order Summary</h3>
      </div>

      <div className={styles.sidebarOrders}>
        {hasMultipleSellers
          ? sellerGroups.map((group) => (
              <article key={group.sellerId} className={styles.sellerOrder}>
                <div className={styles.sellerOrderHeader}>
                  <div>
                    <p className={styles.sellerOrderEyebrow}>Separate order</p>
                    <h4 className={styles.sellerOrderTitle}>{group.sellerCompany}</h4>
                  </div>
                </div>

                <div className={styles.sellerOrderItems}>
                  {group.items.map((item) => (
                    <SummaryItem key={`${group.sellerId}-${item.productId}`} item={item} sellerId={group.sellerId} />
                  ))}
                </div>

                <div className={styles.sellerSummaryCard}>
                  <div className={styles.sellerSummaryRow}>
                    <span>Subtotal</span>
                    <strong>{formatCurrency(group.subtotal)}</strong>
                  </div>
                  <div className={styles.sellerSummaryRow}>
                    <span>Total tax</span>
                    <strong>{formatCurrency(group.totalTax)}</strong>
                  </div>
                  <div className={styles.sellerSummaryRow}>
                    <span>Total</span>
                    <strong>{formatCurrency(group.total)}</strong>
                  </div>
                </div>
              </article>
            ))
          : sellerGroups[0]?.items.map((item) => (
              <SummaryItem key={`${sellerGroups[0].sellerId}-${item.productId}`} item={item} sellerId={sellerGroups[0].sellerId} />
            ))}
      </div>

      <div className={styles.totalPrice}>
        <div className={styles.summaryBlock}>
          <div className={styles.totalInfo}>
            <p>Sub-Total (excl. tax):</p>
            <span className={styles.price}>{formatCurrency(cartSummary.subtotal)}</span>
          </div>
        </div>
        <div className={styles.summaryBlock}>
          <div className={styles.totalInfo}>
            <p>Total items:</p>
            <span className={styles.price}>{cartSummary.totalItems}</span>
          </div>
          <div className={styles.totalInfo}>
            <p>Total weight:</p>
            <span className={styles.price}>{formatWeight(cartSummary.totalWeight || 0)}</span>
          </div>
          <div className={styles.totalInfo}>
            <p>Shipping fee:</p>
            <span className={styles.mutedValue}>Billed separately</span>
          </div>
        </div>
        <div className={`${styles.summaryBlock} ${styles.totalBlock}`}>
          <div className={styles.totalInfo}>
            <p>Total tax:</p>
            <span className={styles.price}>{formatCurrency(cartSummary.totalTax || 0)}</span>
          </div>
          <div className={styles.totalInfo}>
            <p className={styles.totalLabel}>Total:</p>
            <span className={styles.greenPrice}>{formatCurrency(cartSummary.grandTotal)}</span>
          </div>
        </div>
        <div className={styles.checkoutButton}>
          <Button
            type='button'
            isLoading={isSubmitting}
            aria-disabled={!canPlaceOrder}
            onClick={onPlaceOrder}
          >
            Place order
          </Button>
        </div>
      </div>
    </div>
  </aside>
);

export { CheckoutOrderSummary };
