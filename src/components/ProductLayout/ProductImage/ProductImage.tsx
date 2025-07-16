import styles from './ProductImage.module.css';

interface ProductImageProps {
  imageUrl: string;
}

const ProductImage = ({ imageUrl }: ProductImageProps) => {
  return (
    <div className={styles.image}>
      <img src={imageUrl} alt='Product image' />
    </div>
  );
};

export { ProductImage };
