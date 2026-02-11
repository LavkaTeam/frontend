import { ArrowLeftPagination } from './ArrowPagination/ArrowLeftPagination';
import { ArrowRightPagination } from './ArrowPagination/ArrowRightPagination';
import { usePagination } from '@/hooks/usePagination';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  noPaddings?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  noPaddings = false,
}: PaginationProps) => {
  const paginationRange = usePagination({ currentPage, totalPages });

  if (totalPages <= 1) return null;

  return (
    <div className={noPaddings ? '' : 'container'}>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.buttonWrapper} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className={styles.arrow}>
            <ArrowLeftPagination />
          </span>
          <span className={styles.button}>Previous</span>
        </button>

        <div className={styles.paginationNumber}>
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === '...') {
              return (
                <span key={`dots-${index}`} className={styles.dots}>
                  ...
                </span>
              );
            }

            return (
              <span
                key={index}
                className={pageNumber === currentPage ? styles.activePage : ''}
                onClick={() => onPageChange(pageNumber as number)}
              >
                {pageNumber}
              </span>
            );
          })}
        </div>

        <button
          className={`${styles.buttonWrapper} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          <span className={styles.button}>Next</span>
          <span className={styles.arrow}>
            <ArrowRightPagination />
          </span>
        </button>
      </div>
    </div>
  );
};

export { Pagination };
