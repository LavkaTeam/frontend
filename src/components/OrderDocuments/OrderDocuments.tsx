import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { useDownloadOrderDocument, useGenerateOrderDocument } from '@/hooks/useOrders';
import { useToast } from '@/hooks/useToast';
import type {
  OrderDocumentDto,
  OrderDocumentType,
} from '@/types/order';
import { extractErrorMessage } from '@/utils/error';

import styles from './OrderDocuments.module.css';

const documentLabels: Record<OrderDocumentType, string> = {
  PURCHASE_ORDER: 'Purchase Order',
  DELIVERY_NOTE: 'Delivery Note',
  PROFORMA_INVOICE: 'Proforma Invoice',
  INVOICE: 'Invoice',
};

const statusLabels = {
  PENDING: 'Generating',
  GENERATED: 'Ready',
  FAILED: 'Failed',
} as const;

type OrderDocumentsProps = {
  orderId: string;
  documents?: OrderDocumentDto[];
  isLoading?: boolean;
  canGenerate?: boolean;
  canForceRegenerate?: boolean;
  canGenerateTypes?: OrderDocumentType[];
  onRefetch?: () => void | Promise<unknown>;
};

const canShowGenerateAction = (
  document: OrderDocumentDto,
  props: Pick<
    OrderDocumentsProps,
    'canGenerate' | 'canForceRegenerate' | 'canGenerateTypes'
  >,
) => {
  if (!props.canGenerate) return false;

  const allowedTypes = props.canGenerateTypes || [];
  if (!allowedTypes.includes(document.type)) return false;

  if (document.status === 'FAILED') return true;
  if (document.type === 'DELIVERY_NOTE') return true;

  return Boolean(props.canForceRegenerate);
};

const OrderDocuments = ({
  orderId,
  documents,
  isLoading,
  canGenerate = false,
  canForceRegenerate = false,
  canGenerateTypes = [],
  onRefetch,
}: OrderDocumentsProps) => {
  const { showToast } = useToast();
  const downloadMutation = useDownloadOrderDocument();
  const generateMutation = useGenerateOrderDocument(orderId);

  const handleDownload = async (documentId: string) => {
    try {
      const { blob, fileName } = await downloadMutation.mutateAsync({
        orderId,
        documentId,
      });

      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast(extractErrorMessage(error, 'Failed to download document.'), 'error');
    }
  };

  const handleGenerate = async (
    documentType: OrderDocumentType,
    force = false,
  ) => {
    try {
      await generateMutation.mutateAsync({
        type: documentType,
        force,
      });

      await onRefetch?.();
      showToast('Document generation started.', 'success');
    } catch (error) {
      showToast(extractErrorMessage(error, 'Failed to generate document.'), 'error');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <Loader variant='section' />
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No documents available for this order yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.documents}>
      {documents.map((document) => {
        const isDownloading =
          downloadMutation.isPending &&
          downloadMutation.variables?.documentId === document.id;
        const canGenerateDocument = canShowGenerateAction(document, {
          canGenerate,
          canForceRegenerate,
          canGenerateTypes,
        });
        const shouldForce =
          canForceRegenerate &&
          document.type === 'PURCHASE_ORDER' &&
          document.status === 'FAILED';

        return (
          <article key={document.id} className={styles.documentCard}>
            <div className={styles.documentMeta}>
              <div className={styles.documentHeader}>
                <h4 className={styles.documentTitle}>
                  {documentLabels[document.type]}
                </h4>
                <span
                  className={`${styles.documentStatus} ${
                    styles[`status${document.status}`]
                  }`}
                >
                  {statusLabels[document.status]}
                </span>
              </div>

              <div className={styles.documentInfo}>
                <p>{document.documentNumber || document.fileName}</p>
                {document.generatedAt ? (
                  <p>
                    Generated:{' '}
                    {new Date(document.generatedAt).toLocaleString('en-US')}
                  </p>
                ) : null}
                {document.errorMessage ? (
                  <p className={styles.errorMessage}>{document.errorMessage}</p>
                ) : null}
              </div>
            </div>

            <div className={styles.documentActions}>
              {document.status === 'GENERATED' ? (
                <Button
                  type='button'
                  onClick={() => handleDownload(document.id)}
                  isLoading={isDownloading}
                >
                  Download
                </Button>
              ) : null}

              {document.status === 'PENDING' ? (
                <button
                  type='button'
                  className={styles.secondaryAction}
                  disabled
                >
                  Generating...
                </button>
              ) : null}

              {document.status === 'FAILED' && canGenerateDocument ? (
                <button
                  type='button'
                  className={styles.secondaryAction}
                  onClick={() => handleGenerate(document.type, shouldForce)}
                  disabled={generateMutation.isPending}
                >
                  {canForceRegenerate ? 'Regenerate' : 'Retry'}
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export { OrderDocuments, documentLabels, statusLabels };
