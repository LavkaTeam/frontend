import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import styles from './StaticPage.module.css';

interface StaticPageProps {
  title: string;
  // Short line above the title, e.g. "For sellers".
  eyebrow?: string;
  intro?: ReactNode;
  // Meta description of the page.
  description: string;
  children: ReactNode;
}

/**
 * Frame of the informational pages (About, FAQ, seller guides, policy):
 * a breadcrumb, the page heading and its sections.
 */
const StaticPage = ({
  title,
  eyebrow,
  intro,
  description,
  children,
}: StaticPageProps) => {
  useDocumentTitle(title, description);

  return (
    <div className={`container ${styles.page}`}>
      <nav className={styles.breadcrumbs} aria-label='Breadcrumb'>
        <Link to='/' className={styles.breadcrumbLink}>
          Home
        </Link>
        <span aria-hidden='true'>/</span>
        <span aria-current='page'>{title}</span>
      </nav>

      <header className={styles.hero}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {intro ? <div className={styles.intro}>{intro}</div> : null}
      </header>

      <div className={styles.body}>{children}</div>
    </div>
  );
};

interface StaticSectionProps {
  title?: string;
  id?: string;
  // 'plain' drops the white card, e.g. for a grid of cards.
  variant?: 'card' | 'plain';
  children: ReactNode;
}

const StaticSection = ({
  title,
  id,
  variant = 'card',
  children,
}: StaticSectionProps) => (
  <section
    id={id}
    className={variant === 'card' ? styles.section : styles.plainSection}
    aria-labelledby={title && id ? `${id}-title` : undefined}
  >
    {title ? (
      <h2 id={id ? `${id}-title` : undefined} className={styles.sectionTitle}>
        {title}
      </h2>
    ) : null}
    <div className={styles.prose}>{children}</div>
  </section>
);

interface InfoCardProps {
  title: string;
  children: ReactNode;
  // Number or short label in the corner, e.g. a step number.
  marker?: ReactNode;
  to?: string;
  linkLabel?: string;
}

// Small white card for grids of facts, steps and links.
const InfoCard = ({ title, children, marker, to, linkLabel }: InfoCardProps) => {
  const content = (
    <>
      {marker !== undefined ? (
        <span className={styles.marker} aria-hidden='true'>
          {marker}
        </span>
      ) : null}
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardText}>{children}</div>
      {to && linkLabel ? (
        <span className={styles.cardLink}>
          {linkLabel} <span aria-hidden='true'>→</span>
        </span>
      ) : null}
    </>
  );

  return to ? (
    <Link to={to} className={`${styles.card} ${styles.cardInteractive}`}>
      {content}
    </Link>
  ) : (
    <article className={styles.card}>{content}</article>
  );
};

const CardGrid = ({
  children,
  columns = 3,
}: {
  children: ReactNode;
  columns?: 2 | 3;
}) => (
  <div className={columns === 2 ? styles.grid2 : styles.grid3}>{children}</div>
);

// Row of call-to-action buttons or links under a section.
const StaticCta = ({ children }: { children: ReactNode }) => (
  <div className={styles.cta}>{children}</div>
);

// Highlighted note, e.g. the demo-project disclaimer.
const StaticNote = ({ children }: { children: ReactNode }) => (
  <aside className={styles.note}>{children}</aside>
);

export { CardGrid, InfoCard, StaticCta, StaticNote, StaticPage, StaticSection };
