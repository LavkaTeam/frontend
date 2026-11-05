import { Link, useLocation, useParams } from 'react-router-dom';

import { CardProduct, CardProductSkeleton } from '@/components/CardProduct';
import { CardSection } from '@/components/CardSection';
import { getArticleBySlug } from '@/data/articlesData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useSearchProducts } from '@/hooks/useSearchProducts';
import type { Article as ArticleData, ArticleBlock } from '@/types/article';

import NotFound from './NotFound';

import styles from './Article.module.css';

// "/accessories" has no :slug param; it is the article with that slug.
const ACCESSORIES_SLUG = 'accessories';

const formatArticleDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const Block = ({ block }: { block: ArticleBlock }) => {
  if (block.type === 'heading') return <h2>{block.text}</h2>;
  if (block.type === 'list') {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block.text}</p>;
};

const RelatedProducts = ({ article }: { article: ArticleData }) => {
  const { products, isLoading } = useSearchProducts(
    { category: article.relatedCategory, size: 8, sort: ['salesCount,desc'] },
    { skipFilters: true },
  );

  if (!isLoading && products.length === 0) return null;

  return (
    <section className={styles.related} aria-labelledby='related-title'>
      <h2 id='related-title' className={styles.relatedTitle}>
        Related products
      </h2>
      {isLoading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <CardProductSkeleton key={index} />
          ))}
        </div>
      ) : (
        <CardSection
          cards={products}
          CardComponent={CardProduct}
          withSlider={products.length > 4}
          noPaddings
        />
      )}
    </section>
  );
};

const ArticleView = ({ article }: { article: ArticleData }) => {
  useDocumentTitle(article.title, article.excerpt);

  return (
    <div className={`container ${styles.page}`}>
      <Link to='/#discover' className={styles.back}>
        <span aria-hidden='true'>←</span> Back to Discover
      </Link>

      <article className={styles.article}>
        <img
          src={article.cover}
          alt=''
          className={styles.cover}
          width={1200}
          height={560}
        />
        <div className={styles.content}>
          <header className={styles.header}>
            <time dateTime={article.date} className={styles.date}>
              {formatArticleDate(article.date)}
            </time>
            <h1 className={styles.title}>{article.title}</h1>
            <p className={styles.excerpt}>{article.excerpt}</p>
          </header>

          <div className={styles.body}>
            {article.body.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>

          <p className={styles.disclaimer}>
            Brand names belong to their owners and are mentioned for
            illustration in a demo project.
          </p>
        </div>
      </article>

      <RelatedProducts article={article} />
    </div>
  );
};

const Article = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const article = getArticleBySlug(
    pathname === '/accessories' ? ACCESSORIES_SLUG : slug,
  );

  // Keyed by slug so moving between articles resets the page state.
  return article ? (
    <ArticleView key={article.slug} article={article} />
  ) : (
    <NotFound />
  );
};

export default Article;
