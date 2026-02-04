import { useMemo } from 'react';
import { CardSection } from '@/components/CardSection/CardSection';
import { CardProduct } from '@/components/CardProduct/CardProduct';
import { productData } from '@/data/productData';
import { Space } from '@/components/ui/Space';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { useAppSelector } from '@/store/hooks';
import { EmptyFavoritesIcon } from '@/components/ui/icons/EmptyFavoritesIcon';

import styles from './BuyerFavorites.module.css';

const BuyerFavorites = () => {
  // Отримуємо список ID улюблених товарів з Redux
  const favoriteIds = useAppSelector((state: any) => state.favorites);

  // Фільтруємо базу даних товарів, залишаючи тільки ті, що є в обраному
  const favoriteProducts = useMemo(() => {
    return productData.filter((product) => favoriteIds.includes(product.id));
  }, [favoriteIds]);

  return (
    <div className={styles.FavoritesWrapper}>
      <div>
        <HeadingH3>Favorites</HeadingH3>
        <Space height='32px' />
      </div>

      {favoriteProducts.length > 0 ? (
        <CardSection
          cards={favoriteProducts}
          CardComponent={CardProduct}
          noPaddings={true}
        />
      ) : (
        <>
          <Space height='32px' />
          <div className={styles.EmptyFavorites}>
            <EmptyFavoritesIcon />
            <Space height='16px' />
            <p>You haven't added any products to favorites yet.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerFavorites;
