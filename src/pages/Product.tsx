// src/pages/Product.tsx
import { useParams } from 'react-router-dom';
import { ProductLayout } from '@/components/ProductLayout';
import { CardSection } from '@/components/CardSection';
import { CardProduct } from '@/components/CardProduct';
import { productData } from '@/data/productData'; // Використовуємо Product[]
import { useRandomCards } from '@/hooks/useRandomCards'; // Ваш спрощений хук

const Product = () => {
  const { productId } = useParams<{ productId: string }>();

  // Знаходимо поточний продукт за ID
  const currentProduct = productData.find((p) => p.id === productId);

  // Отримуємо 4 випадкові картки за допомогою спрощеного хука
  const randomCards = useRandomCards(productData); // Хук сам визначає 4 картки

  return (
    <>
      {/* Передаємо знайдений об'єкт продукту до ProductLayout */}
      <ProductLayout product={currentProduct} />
      <CardSection
        title='Top selections for you'
        cards={randomCards}
        CardComponent={CardProduct}
        withSlider={false}
        cardsPerPage={4}
      />
    </>
  );
};
export default Product;
