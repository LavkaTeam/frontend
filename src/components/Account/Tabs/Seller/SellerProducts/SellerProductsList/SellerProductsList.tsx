import type { Product } from '@/types/productCard';
import { SellerProductItem } from './SellerProductItem/SellerProductItem';
import styles from './SellerProductsList.module.css';

interface Props {
  products: Product[];
  isLoading?: boolean;
}

export const SellerProductsList = ({ products, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        {/* Тут можна додати твій <Loader /> */}
        <p>Loading your products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>Your catalog is empty</h3>
        <p>Add your first product to start selling.</p>
      </div>
    );
  }

  const handleEditProduct = (id: string) => {
    console.log('Navigate to edit page for ID:', id);
    // navigation(`/seller/products/${id}/edit`);
  };

  return (
    <div className={styles.listContainer}>
      {products.map((product) => (
        <SellerProductItem
          key={product.id}
          product={product}
          onEdit={handleEditProduct}
        />
      ))}
    </div>
  );
};
