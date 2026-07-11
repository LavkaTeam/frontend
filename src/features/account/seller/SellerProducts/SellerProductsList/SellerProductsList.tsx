import type { SellerProductSummary } from '@/types/productCard';

import { SellerProductItem } from './SellerProductItem/SellerProductItem';
import styles from './SellerProductsList.module.css';

interface Props {
  products: SellerProductSummary[];
  onEdit: (id: string) => void;
}

export const SellerProductsList = ({ products, onEdit }: Props) => {
  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h4>No products found</h4>
        <p>Create your first product or adjust the selected filter.</p>
      </div>
    );
  }

  return (
    <div className={styles.productsList}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <SellerProductItem key={product.id} product={product} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
