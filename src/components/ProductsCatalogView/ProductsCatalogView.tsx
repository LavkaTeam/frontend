import { FilterBlock } from '../Filters/FilterBlock';
import { CardSection } from '@/components/CardSection';
import { CardProduct } from '@/components/CardProduct';
import { productData } from '@/data/productData';
import { Pagination } from '@/components/Pagination';

import styles from './ProductsCatalogView.module.css';

const ProductsCatalogView = () => {
  return (
    <div className={styles.container}>
      <FilterBlock />
      <div>
        <CardSection
          title={false}
          cards={productData}
          CardComponent={CardProduct}
          noPaddings={true}
        />
        <Pagination noPaddings={true} />
      </div>
    </div>
  );
};

export { ProductsCatalogView };
