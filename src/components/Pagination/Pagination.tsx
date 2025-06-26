import { ArrowLeftPagination } from './ArrowPagination/ArrowLeftPagination';
import { ArrowRightPagination } from './ArrowPagination/ArrowRightPagination';

import styles from './Pagination.module.css';

interface PaginationProps {
  noPaddings?: boolean;
}

const Pagination = ({ noPaddings = false }: PaginationProps) => {
  return (
    <div className={noPaddings ? '' : 'container'}>
      <div className={styles.buttonContainer}>
        <div className={styles.buttonWrapper}>
          <span className={styles.arrow}>
            <ArrowLeftPagination />
          </span>
          <span className={styles.button}>Previous</span>
        </div>
        <div className={styles.paginationNumber}>
          <span className={styles.activePage}>1</span>
          <span>2</span>
          <span>3</span>
        </div>
        <div className={styles.buttonWrapper}>
          <span className={styles.button}>Next</span>
          <span className={styles.arrow}>
            <ArrowRightPagination />
          </span>
        </div>
      </div>
    </div>
  );
};

export { Pagination };