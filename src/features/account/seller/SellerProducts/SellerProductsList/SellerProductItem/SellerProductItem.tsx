import type { SellerProductSummary } from '@/types/productCard';

import { EditProductIcon } from '@/components/ui/icons/EditProductIcon';
import { Tooltip } from '@/components/ui/Tooltip';
import { getModerationNotice } from '@/utils/productModeration';

import styles from './SellerProductItem.module.css';

interface Props {
  product: SellerProductSummary;
  onEdit: (id: string) => void;
}

const formatLabel = (value: string) =>
  value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

const formatStatusText = (status: string) => formatLabel(status);

const getStatusClass = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return styles.statusActive;
    case 'HIDDEN':
      return styles.statusHidden;
    case 'UNDER_REVIEW':
      return styles.statusReview;
    case 'ARCHIVED':
      return styles.statusArchived;
    default:
      return styles.statusHidden;
  }
};

export const SellerProductItem = ({ product, onEdit }: Props) => {
  const notice = getModerationNotice(product);
  const shouldShowVolume =
    product.category !== 'BARWARE_ACCESSORIES' &&
    typeof product.volume === 'number' &&
    product.volume > 0;

  const productMetaParts = [
    shouldShowVolume ? `${product.volume}L` : null,
    product.producer || null,
  ].filter(Boolean);

  return (
    <tr className={styles.row}>
      <td className={styles.cellWithBorder}>
        <div className={styles.productCell}>
          <div className={styles.imageWrapper}>
            <img
              src={product.mainImage?.url || '/placeholder-bottle.png'}
              alt={product.name}
              className={styles.productImg}
            />
          </div>

          <div className={styles.productInfo}>
            <span className={styles.productName}>{product.name}</span>
            {productMetaParts.length > 0 ? (
              <span className={styles.productMeta}>
                {productMetaParts.join(' · ')}
              </span>
            ) : null}
          </div>
        </div>
      </td>

      <td className={styles.cellWithBorder}>{formatLabel(product.category)}</td>
      <td className={styles.cellWithBorder}>{product.quantity}</td>
      <td className={styles.cellWithBorder}>${product.price.toFixed(2)}</td>
      <td className={styles.cellWithBorder}>
        <div className={styles.statusCell}>
          {notice && notice.kind !== 'UNDER_REVIEW' ? (
            // Only the status here; the reason is in the tooltip and on the
            // edit page, so the row keeps its height. A blocked or rejected
            // product is always hidden, so one badge says it all.
            <Tooltip
              content={
                <>
                  <strong>{notice.title}</strong>
                  {notice.reason ? (
                    <>
                      <br />
                      {notice.reason}
                    </>
                  ) : null}
                </>
              }
            >
              <span
                className={`${styles.status} ${
                  notice.kind === 'BLOCKED'
                    ? styles.statusBlocked
                    : styles.statusRejected
                }`}
              >
                {notice.kind === 'BLOCKED' ? 'Blocked' : 'Rejected'}
              </span>
            </Tooltip>
          ) : (
            <span
              className={`${styles.status} ${getStatusClass(product.status)}`}
            >
              {formatStatusText(product.status)}
            </span>
          )}
        </div>
      </td>
      <td>
        <button
          type='button'
          className={styles.editBtn}
          onClick={() => onEdit(product.id)}
          aria-label={`Edit ${product.name}`}
        >
          <EditProductIcon />
        </button>
      </td>
    </tr>
  );
};
