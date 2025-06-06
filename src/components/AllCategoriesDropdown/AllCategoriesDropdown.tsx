import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AllCategoriesDropdown.module.css';

interface Subcategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Wine',
    subcategories: [
      { id: 1, name: 'Red Wine' },
      { id: 2, name: 'White Wine' },
      { id: 3, name: 'Rosé Wine' },
    ],
  },
  {
    id: 2,
    name: 'Beer',
    subcategories: [
      { id: 1, name: 'Lager' },
      { id: 2, name: 'Ale' },
      { id: 3, name: 'Stout' },
    ],
  },
  {
    id: 3,
    name: 'Strong Drinks',
    subcategories: [
      { id: 1, name: 'Whiskey' },
      { id: 2, name: 'Vodka' },
      { id: 3, name: 'Tequila' },
    ],
  },
  {
    id: 4,
    name: 'Low alcohol Drinks',
    subcategories: [
      { id: 1, name: 'Cider' },
      { id: 2, name: 'Light Beer' },
      { id: 3, name: 'Wine Cooler' },
    ],
  },
  {
    id: 5,
    name: 'Soft Drinks',
    subcategories: [
      { id: 1, name: 'Cola' },
      { id: 2, name: 'Lemonade' },
      { id: 3, name: 'Ice tea' },
    ],
  },
];

const AllCategoriesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subcategoriesTop, setSubcategoriesTop] = useState(0);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isSubCollapsing, setIsSubCollapsing] = useState(false);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (isOpen) {
      setIsCollapsing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsCollapsing(false);
        setSelectedCategory(null);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory?.id === category.id) {
      setIsSubCollapsing(true);
      setTimeout(() => {
        setSelectedCategory(null);
        setIsSubCollapsing(false);
      }, 300);
    } else if (selectedCategory) {
      setIsSubCollapsing(true);
      setTimeout(() => {
        setSelectedCategory(category);
        setIsSubCollapsing(false);
      }, 300);
    } else {
      setSelectedCategory(category);
    }
  };

  useEffect(() => {
    if (selectedCategory && isOpen) {
      const selectedIndex = categories.findIndex(cat => cat.id === selectedCategory.id);
      const selectedRef = categoryRefs.current[selectedIndex];
      if (selectedRef) {
        setSubcategoriesTop(selectedRef.offsetTop);
      }
    }
  }, [selectedCategory, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCollapsing(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsCollapsing(false);
          setSelectedCategory(null);
        }, 300);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.categoryMenu} ref={menuRef}>
      <button className={styles.categoryButton} onClick={toggleDropdown}>
        <p className={styles.label}>All</p>
        <img
          src='/icons/AllCategoriesDropdown.svg'
          alt='Dropdown arrow'
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
        />
        <p className={`${styles.label} ${isOpen ? styles.labelOpen : ''}`}>Categories</p>
      </button>
      {isOpen && (
        <div
          className={`${styles.dropdownContainer} ${isCollapsing ? styles.collapsing : ''}`}
        >
          <div className={styles.categoriesList}>
            {categories.map((category, index) => (
              <div
                key={category.id}
                ref={(el: HTMLDivElement | null) => {
                  categoryRefs.current[index] = el;
                }}
                className={styles.categoryItem}
                onClick={() => handleCategoryClick(category)}
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
          {selectedCategory && (
            <div
              className={`${styles.subcategoriesList} ${isSubCollapsing ? styles.subCollapsing : ''}`}
              style={{ top: `${subcategoriesTop}px` }}
            >
              {selectedCategory.subcategories.map(subcategory => (
                <Link
                  key={subcategory.id}
                  to={`/categories/${selectedCategory.id}/subcategories/${subcategory.id}`}
                  className={styles.subcategoryItem}
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { AllCategoriesDropdown };