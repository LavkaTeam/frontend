import { useDropdown } from '@/hooks/useDropdown';
import CategoryList from '../CategoryList/CategoryList';
import SubcategoryList from '../SubcategoryList/SubcategoryList';

import styles from './AllCategoriesDropdown.module.css';

const AllCategoriesDropdown = () => {
  const {
    isOpen,
    selectedCategory,
    subcategoriesTop,
    isCollapsing,
    isSubCollapsing,
    categoryRefs,
    menuRef,
    toggleDropdown,
    handleCategoryHover,
  } = useDropdown();

  return (
    <div className={styles.categoryMenu} ref={menuRef}>
      <button className={styles.categoryButton} onClick={toggleDropdown}>
        <p className={styles.label}>All</p>
        <img
          src='/icons/AllCategoriesDropdown.svg'
          alt='Dropdown arrow'
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
        />
        <p className={`${styles.label} ${isOpen ? styles.labelOpen : ''}`}>
          Categories
        </p>
      </button>
      {isOpen && (
        <div
          className={`${styles.dropdownContainer} ${
            isCollapsing ? styles.collapsing : ''
          }`}
        >
          <CategoryList
            categoryRefs={categoryRefs}
            selectedCategory={selectedCategory}
            handleCategoryHover={handleCategoryHover}
          />
          {selectedCategory && (
            <SubcategoryList
              selectedCategory={selectedCategory}
              isSubCollapsing={isSubCollapsing}
              subcategoriesTop={subcategoriesTop}
            />
          )}
        </div>
      )}
    </div>
  );
};

export { AllCategoriesDropdown };
