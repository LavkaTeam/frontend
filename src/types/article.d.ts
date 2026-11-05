import type { ProductCategory } from './productCard';

export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] };

export interface Article {
  slug: string;
  // Route of the article; the Discover cards and the accessories lead card
  // link to these exact URLs.
  path: string;
  title: string;
  // ISO date, YYYY-MM-DD.
  date: string;
  cover: string;
  excerpt: string;
  body: ArticleBlock[];
  relatedCategory: ProductCategory;
}
