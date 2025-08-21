import { Link } from 'react-router-dom';
import { categories } from '@/data/categoriesData';
import type { Category } from '@/types/categoryTypes';
import styles from './CategoryList.module.css';

interface CategoryListProps {
  categoryRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  selectedCategory: Category | null;
  handleCategoryHover: (category: Category) => void;
  handleCategoryClick: (category: Category) => void;
}

const CategoryList = ({
  categoryRefs,
  handleCategoryHover,
  handleCategoryClick,
}: CategoryListProps) => {
  return (
    <div className={styles.categoriesList}>
      {categories.map((category, index) => (
        <div>
          <Link
            to={`/products/${encodeURIComponent(
              category.name.toLowerCase().replace(/\s/g, '-'),
            )}`}
            onClick={() => handleCategoryClick(category)}
          >
            <div
              key={category.id}
              ref={(el: HTMLDivElement | null) => {
                categoryRefs.current[index] = el;
              }}
              className={styles.categoryItem}
              onMouseEnter={() => handleCategoryHover(category)}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <img
                  src='/icons/dropdown-arrow.svg'
                  alt='Arrow'
                  className={styles.checkmarkIcon}
                />
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
