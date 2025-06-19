import { categories } from '@/data/categoriesData';
import type { Category } from '@/types/categoryTypes';

import styles from './CategoryList.module.css';

interface CategoryListProps {
  categoryRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  selectedCategory: Category | null;
  handleCategoryHover: (category: Category) => void;
}

const CategoryList = ({
  categoryRefs,
  selectedCategory,
  handleCategoryHover,
}: CategoryListProps) => {
  return (
    <div className={styles.categoriesList}>
      {categories.map((category, index) => (
        <div
          key={category.id}
          ref={(el: HTMLDivElement | null) => {
            categoryRefs.current[index] = el;
          }}
          className={styles.categoryItem}
          onMouseEnter={() => handleCategoryHover(category)}
        >
          {category.name}
          {selectedCategory?.id === category.id && (
            <img
              src='/icons/checkTick.svg'
              alt='Selected'
              className={styles.checkmarkIcon}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
