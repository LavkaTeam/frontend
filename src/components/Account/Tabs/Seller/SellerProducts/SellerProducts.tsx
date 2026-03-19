import { useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import type { Product } from '@/types/productCard';

import { Button } from '@/components/ui/Button';
import { SellerProductsList } from './SellerProductsList/SellerProductsList';
import { FilterIcon } from '@/components/ui/icons/FilterIcon';
import { FilterMenu } from '@/components/ui/FilterMenu/FilterMenu';
import { ActiveFiltersBar } from '@/components/ui/ActiveFiltersBar/ActiveFiltersBar';
import { SellerAddProduct } from './SellerAddProduct/SellerAddProduct';

import styles from './SellerProducts.module.css';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Macabeo Brut',
    volume: '0,75 L',
    producer: 'Spain / Belle Grove',
    price: 47.0,
    mainCategory: 'Wine',
    category: 'Sparkling wine',
    subcategory: 'Brut',
    status: 'ACTIVE',
    alcohol: 11.5,
    quantity: 100,
    description: 'Fresh and fruity sparkling wine.',
    mainImage: {
      id: 'img1',
      url: 'https://res.cloudinary.com/dvwjc7xsy/image/upload/v1770930409/SchweppesSodaWater325ml_f3cury.png',
      publicId: 'assets/wine1',
    },
    images: [],
    seller: {
      name: 'Nazarii',
      lastName: 'Fito',
      email: 'seller@example.com',
      phone: '+123456789',
      company: 'Lavka Team',
    },
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Macabeo Brut',
    volume: '0,75 L',
    producer: 'Spain / Belle Grove',
    price: 47.0,
    mainCategory: 'Beer',
    category: 'Sparkling wine',
    subcategory: 'Brut',
    status: 'ARCHIVED',
    alcohol: 11.5,
    quantity: 50,
    description: 'Best seller.',
    mainImage: {
      id: 'img2',
      url: 'https://res.cloudinary.com/dvwjc7xsy/image/upload/v1770930409/SchweppesSodaWater325ml_f3cury.png',
      publicId: 'assets/wine2',
    },
    images: [],
    seller: {
      name: 'Nazarii',
      lastName: 'Fito',
      email: '',
      phone: '',
      company: '',
    },
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-02-14T10:00:00Z',
  },
  {
    id: '3',
    name: 'Macabeo Brut',
    volume: '0,75 L',
    producer: 'Spain / Belle Grove',
    price: 47.0,
    mainCategory: 'Beer',
    category: 'Sparkling wine',
    subcategory: 'Brut',
    status: 'HIDDEN',
    alcohol: 12,
    quantity: 0,
    description: 'Hidden product',
    mainImage: {
      id: 'img3',
      url: 'https://res.cloudinary.com/dvwjc7xsy/image/upload/v1770930409/SchweppesSodaWater325ml_f3cury.png',
      publicId: 'assets/wine3',
    },
    images: [],
    seller: {
      name: 'Nazarii',
      lastName: 'Fito',
      email: '',
      phone: '',
      company: '',
    },
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: '4',
    name: 'Macabeo Brut',
    volume: '0,75 L',
    producer: 'Spain / Belle Grove',
    price: 47.0,
    mainCategory: 'Strong Drinks',
    category: 'Sparkling wine',
    subcategory: 'Brut',
    status: 'UNDER_REVIEW',
    alcohol: 12,
    quantity: 10,
    description: 'New arrival',
    mainImage: {
      id: 'img4',
      url: 'https://res.cloudinary.com/dvwjc7xsy/image/upload/v1770930409/SchweppesSodaWater325ml_f3cury.png',
      publicId: 'assets/wine4',
    },
    images: [],
    seller: {
      name: 'Nazarii',
      lastName: 'Fito',
      email: '',
      phone: '',
      company: '',
    },
    createdAt: '2026-02-15T12:00:00Z',
    updatedAt: '2026-02-15T12:00:00Z',
  },
];

// Словник пріоритетів для статусів: чим менше число, тим вище в списку
const STATUS_ORDER: Record<string, number> = {
  ACTIVE: 1,
  UNDER_REVIEW: 2,
  HIDDEN: 3,
  ARCHIVED: 4,
};

const SellerProducts = () => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const isAddingProduct = searchParams.get('action') === 'new';

  const filterRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(filterRef, () => setIsFilterOpen(false));

  const availableCategories = useMemo(() => {
    const categories = new Set(products.map((p) => p.mainCategory));
    return Array.from(categories);
  }, [products]);

  // Фільтруємо і одразу сортуємо продукти
  const filteredAndSortedProducts = useMemo(() => {
    const filtered =
      selectedCategories.length === 0
        ? products
        : products.filter((p) => selectedCategories.includes(p.mainCategory));

    return [...filtered].sort((a, b) => {
      const orderA = STATUS_ORDER[a.status.toUpperCase()] || 99;
      const orderB = STATUS_ORDER[b.status.toUpperCase()] || 99;
      return orderA - orderB;
    });
  }, [products, selectedCategories]);

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setIsFilterOpen(false);
  };

  const handleAddProduct = () => {
    setSearchParams((prev) => {
      prev.set('action', 'new');
      return prev;
    });
  };

  const handleCancelAddProduct = () => {
    setSearchParams((prev) => {
      prev.delete('action');
      return prev;
    });
  };

  if (isAddingProduct) {
    return (
      <SellerAddProduct
        onCancel={() => handleCancelAddProduct()}
        onSave={(data) => {
          console.log('Saved data:', data);
          // Тут буде логіка збереження на бекенд
          handleCancelAddProduct();
        }}
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>My products</h1>
          <p className={styles.subTitle}>
            Add, edit, or remove products in your catalog.
          </p>
        </div>

        <div className={styles.actionBlock}>
          <Button onClick={handleAddProduct}>Add product</Button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div ref={filterRef} className={styles.filterWrapper}>
          <button
            className={`${styles.filterBtn} ${isFilterOpen ? styles.filterBtnActive : ''}`}
            aria-label='Filter products'
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FilterIcon />
          </button>

          <FilterMenu
            title='Category Filter:'
            isOpen={isFilterOpen}
            options={availableCategories}
            selectedOptions={selectedCategories}
            onToggleOption={handleToggleCategory}
            onClearFilters={handleClearFilters} // Тут краще юзати готову функцію
          />
        </div>

        {/* ОСЬ НОВИЙ КОМПОНЕНТ ЗАМІСТЬ СТАРОГО КОДУ */}
        <ActiveFiltersBar
          selectedOptions={selectedCategories}
          onRemoveOption={handleToggleCategory}
          onClearAll={handleClearFilters}
        />
      </div>

      <SellerProductsList products={filteredAndSortedProducts} />
    </div>
  );
};

export default SellerProducts;
