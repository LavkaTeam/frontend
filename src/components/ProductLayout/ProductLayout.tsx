import { ProductDetails } from './ProductDetails/ProductDetails';
import { ProductImage } from './ProductImage/ProductImage';
import styles from './ProductLayout.module.css';
import type { Product } from '@/types/products'; // Використовуємо ваш інтерфейс Product

interface ProductLayoutProps {
  product: Product;
}

const ProductLayout = ({ product }: ProductLayoutProps) => {
  return (
    <div className={styles.productLayout}>
      <div className='container'>
        {product && (
          <div className={styles.productContainer}>
            <div className={styles.photosContainer}>
              <ProductImage imageUrl={product.mainImage.url} />
            </div>
            <div className={styles.infoContainer}>
              <ProductDetails product={product} />
            </div>
            {/*<h1>{product.name}</h1>
           <p>Producer: {product.producer}</p>
          <p>Description: {product.description}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Volume: {product.volume}</p>
          <p>Strength: {product.strength}</p>
          <p>Quantity in Stock: {product.quantity}</p>
          <p>Status: {product.status}</p>
          <p>Category: {product.category}</p>
          <p>Subcategory: {product.subcategory}</p>
          <p>
            Seller: {product.seller.name} ({product.seller.companyName})
          </p>
          <p>Seller Email: {product.seller.email}</p>
          <p>Seller Phone: {product.seller.telephoneNumber}</p> */}
          </div>
        )}
        {!product && <h2 className={styles.notFound}>Product is not found</h2>}
      </div>
    </div>
  );
};

export { ProductLayout };
