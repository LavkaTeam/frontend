import styles from './ProductDetails.module.css';
import type { Product } from '@/types/products'; // Використовуємо ваш інтерфейс Product

interface ProductDetailsProps {
  product: Product; // Приймаємо об'єкт продукту
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <>
      <h2>
        {product.name} {product.volume}L {product.producer}
      </h2>
    </>
  );
};

export { ProductDetails };
