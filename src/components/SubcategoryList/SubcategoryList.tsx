import { Link } from 'react-router-dom';
import type { Category } from '@/types/categoryTypes';

import styles from './SubcategoryList.module.css';

interface SubcategoryListProps {
  selectedCategory: Category;
  isSubCollapsing: boolean;
  subcategoriesTop: number;
}

const SubcategoryList = ({
  selectedCategory,
  isSubCollapsing,
  subcategoriesTop,
}: SubcategoryListProps) => {
  return (
    <div
      className={`${styles.subcategoriesList} ${
        isSubCollapsing ? styles.subCollapsing : ''
      }`}
      style={{ top: `${subcategoriesTop}px` }}
    >
      {selectedCategory.subcategories.map((subcategory) => (
        <Link
          key={subcategory.id}
          to={`/categories/${selectedCategory.id}/subcategories/${subcategory.id}`}
          className={styles.subcategoryItem}
        >
          {subcategory.name}
        </Link>
      ))}
    </div>
  );
};

export default SubcategoryList;
