export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
}

export interface Seller {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

export interface Product {
  id: string;
  mainImage: ProductImage;
  images: ProductImage[];
  name: string;
  producer: string;
  price: number;
  volume: string;
  quantity: number;
  mainCategory: string;
  alcohol: number;
  description: string;
  status: string;
  category: string;
  subcategory: string;
  seller: Seller;
  createdAt: string;
  updatedAt: string;
}
