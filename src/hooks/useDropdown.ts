import { useState, useEffect, useRef } from 'react';
import type { Category } from '../types/categoryTypes';
import { categories } from '../data/categoriesData';

export const useDropdown = () => {
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

  return {
    isOpen,
    selectedCategory,
    subcategoriesTop,
    isCollapsing,
    isSubCollapsing,
    categoryRefs,
    menuRef,
    toggleDropdown,
    handleCategoryClick,
  };
};