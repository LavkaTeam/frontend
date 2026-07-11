import type { OrderResponseItemDto } from '@/types/order';
import { formatCurrency } from '../../../model/orderDisplay';

import styles from '../BuyerOrder.module.css';

type BuyerOrderProductsTableProps = {
  items: OrderResponseItemDto[];
  totalGoodsLabel: string;
  onProductClick: (productId: string) => void;
};

const getInlineMeta = (item: OrderResponseItemDto) => {
  const titleMeta = [
    item.volume ? `${item.volume} L` : null,
    typeof item.alcohol === 'number' && item.alcohol >= 0
      ? `${item.alcohol}%`
      : null,
  ]
    .filter(Boolean)
    .join(', ');

  const originMeta = [item.country, item.producer].filter(Boolean).join(' / ');

  return [item.name || 'Product', titleMeta || null, originMeta || null]
    .filter(Boolean)
    .join(', ');
};

const BuyerOrderProductsTable = ({
  items,
  totalGoodsLabel,
  onProductClick,
}: BuyerOrderProductsTableProps) => (
  <section className={`${styles.sectionCard} ${styles.productsSection}`}>
    <div className={styles.productsHeader}>
      <h2 className={styles.sectionTitle}>Ordered Goods</h2>
      <span className={styles.goodsCounter}>{totalGoodsLabel}</span>
    </div>

    <div className={styles.productsTable}>
      <div className={styles.tableHeader}>
        <span className={styles.tableHeaderMain}>Product</span>
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      <div className={styles.tableBody}>
        {items.map((item) => {
          const unitTax = item.quantity > 0 ? item.itemTax / item.quantity : 0;
          const totalValue = item.itemSubtotal + item.itemTax;

          return (
            <article
              key={item.productId}
              className={styles.tableRow}
              onClick={() => onProductClick(item.productId)}
            >
              <div className={styles.productCell}>
                <div className={styles.itemImageWrap}>
                  {item.mainImage?.url ? (
                    <img
                      src={item.mainImage.url}
                      alt={item.name || 'Product'}
                      className={styles.itemImage}
                    />
                  ) : (
                    <div className={styles.placeholderImg} />
                  )}
                </div>

                <div className={styles.productContent}>
                  <div className={styles.productTitleRow}>
                    <h3 className={styles.itemTitle}>{getInlineMeta(item)}</h3>
                  </div>
                </div>
              </div>

              <div className={styles.tablePriceCell}>
                <span className={styles.tableCellPrice}>
                  {formatCurrency(item.price)}
                </span>
                <span className={styles.tableCellNote}>
                  + {formatCurrency(unitTax)} tax
                </span>
              </div>
              <span className={styles.tableCellStrong}>{item.quantity}</span>
              <span className={styles.tableCellTotal}>
                {formatCurrency(totalValue)}
              </span>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export { BuyerOrderProductsTable };
