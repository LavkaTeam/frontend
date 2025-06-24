import { useDropdown } from '@/hooks/useDropdown';
import CategoryList from '../CategoryList/CategoryList';
import SubcategoryList from '../SubcategoryList/SubcategoryList';
import styles from './AllCategoriesDropdown.module.css';

const AllCategoriesDropdown = () => {
  const {
    isOpen,
    selectedCategory,
    subcategoriesTop,
    categoryRefs,
    menuRef,
    toggleDropdown,
    handleCategoryHover,
    closeDropdown,
  } = useDropdown();

  const handleCategoryClick = () => {
    closeDropdown();
  };

  return (
    <div
      className={styles.categoryMenu}
      ref={menuRef}
    >
      <button
        className={`${styles.categoryButton} ${isOpen ? styles.categoryButtonOpen : ''}`}
        onClick={toggleDropdown}
        >
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
          className={styles.dropdownContainer}
        >
          <CategoryList
            categoryRefs={categoryRefs}
            selectedCategory={selectedCategory}
            handleCategoryHover={handleCategoryHover}
            handleCategoryClick={handleCategoryClick}
          />
          {selectedCategory &&
            selectedCategory.subcategories &&
            selectedCategory.subcategories.length > 0 && (
            <SubcategoryList
              selectedCategory={selectedCategory}
              isSubCollapsing={false}
              subcategoriesTop={subcategoriesTop}
              closeDropdown={closeDropdown}
            />
          )}
        </div>
      )}
    </div>
  );
};

export { AllCategoriesDropdown };