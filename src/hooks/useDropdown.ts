import { useState, useEffect, useRef, useCallback } from 'react';
import { categories } from '../data/categoriesData';
import type { Category } from '@/types/categoryTypes';

export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subcategoriesTop, setSubcategoriesTop] = useState(0);

  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSelectedCategory(null);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [isOpen, closeDropdown, openDropdown]);

  const handleCategoryHover = useCallback((category: Category) => {
    setSelectedCategory(category);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    if (selectedCategory && isOpen) {
      const selectedIndex = categories.findIndex(
        (cat) => cat.id === selectedCategory.id,
      );
      const selectedRef = categoryRefs.current[selectedIndex];
      if (selectedRef) {
        setSubcategoriesTop(selectedRef.offsetTop);
      }
    }
  }, [selectedCategory, isOpen]);

  return {
    isOpen,
    selectedCategory,
    subcategoriesTop,
    categoryRefs,
    menuRef,
    toggleDropdown,
    handleCategoryHover,
    closeDropdown,
  };
};