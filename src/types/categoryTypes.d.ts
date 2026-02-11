export interface Subcategory {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  subcategories: Subcategory[];
}
