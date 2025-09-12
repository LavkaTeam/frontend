import { CardSection } from '@/components/CardSection/CardSection';
import { CardProduct } from '@/components/CardProduct/CardProduct';
import { productData } from '@/data/productData';

const BuyerFavorites = () => {
  return (
    <CardSection
      title='Favorites'
      cards={productData}
      CardComponent={CardProduct}
      noPaddings={true}
    />
  );
};

export default BuyerFavorites;
