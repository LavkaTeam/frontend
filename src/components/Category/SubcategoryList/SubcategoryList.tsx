import { Link } from 'react-router-dom';
import type { Category } from '@/types/categoryTypes';

import styles from './SubcategoryList.module.css';

interface SubcategoryListProps {
  selectedCategory: Category;
  isSubCollapsing: boolean;
  subcategoriesTop: number;
  closeDropdown: () => void;
}

const SubcategoryList = ({
  selectedCategory,
  subcategoriesTop,
  closeDropdown,
}: SubcategoryListProps) => {
  return (
    <div
      className={`${styles.subcategoriesList}`}
      style={{ top: `${subcategoriesTop}px` }}
    >
      {selectedCategory.subcategories.map((subcategory) => (
        <Link
          key={subcategory.id}
          to={`/products?category=${encodeURIComponent(selectedCategory.id)}&subcategory=${encodeURIComponent(subcategory.id)}`}
          className={styles.subcategoryItem}
          onClick={closeDropdown}
        >
          {subcategory.label}
        </Link>
      ))}
    </div>
  );
};

export default SubcategoryList;
