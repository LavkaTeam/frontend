import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import {
  useDownloadOrderDocument,
  useGenerateOrderDocument,
} from '@/hooks/useOrders';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useToast } from '@/hooks/useToast';
import type { OrderDocumentDto, OrderDocumentType } from '@/types/order';
import { extractErrorMessage } from '@/utils/error';

import {
  documentLabels,
  GENERATABLE_DOCUMENT_TYPES,
  statusLabels,
} from './orderDocument.constants';
import styles from './OrderDocuments.module.css';

type OrderDocumentsProps = {
  orderId: string;
  documents?: OrderDocumentDto[];
  isLoading?: boolean;
  canGenerate?: boolean;
  // Admin only: the backend rejects `force` from anyone else.
  canForceRegenerate?: boolean;
  toolbarTitle?: string;
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
  toolbarTitle = 'Seller documents',
  canGenerateTypes = [],
  onRefetch,
}: OrderDocumentsProps) => {
  const { showToast } = useToast();
  const downloadMutation = useDownloadOrderDocument();
  const generateMutation = useGenerateOrderDocument(orderId);
  const [isGenerateMenuOpen, setIsGenerateMenuOpen] = useState(false);
  const [isGenerateMenuVisible, setIsGenerateMenuVisible] = useState(false);
  const generateMenuRef = useRef<HTMLDivElement>(null);

  const closeGenerateMenu = () => {
    setIsGenerateMenuVisible(false);
    window.setTimeout(() => {
      setIsGenerateMenuOpen(false);
    }, 220);
  };

  useOnClickOutside(generateMenuRef, () => {
    if (isGenerateMenuOpen) {
      closeGenerateMenu();
    }
  });

  useEffect(() => {
    if (isGenerateMenuOpen) {
      const timer = window.setTimeout(() => {
        setIsGenerateMenuVisible(true);
      }, 10);

      return () => window.clearTimeout(timer);
    }

    setIsGenerateMenuVisible(false);
    return undefined;
  }, [isGenerateMenuOpen]);

  const availableDocuments = useMemo(() => documents ?? [], [documents]);
  const availableGeneratableTypes = GENERATABLE_DOCUMENT_TYPES.filter((type) =>
    canGenerateTypes.includes(type),
  );
  const latestDocumentByType = useMemo(() => {
    const nextMap = new Map<OrderDocumentType, OrderDocumentDto>();

    availableDocuments.forEach((document) => {
      const current = nextMap.get(document.type);

      if (
        !current ||
        new Date(document.generatedAt || 0).getTime() >=
          new Date(current.generatedAt || 0).getTime()
      ) {
        nextMap.set(document.type, document);
      }
    });

    return nextMap;
  }, [availableDocuments]);

  const handleDownload = async (documentId: string) => {
    try {
      const targetDocument = availableDocuments.find(
        (document) => document.id === documentId,
      );
      const { blob, fileName } = await downloadMutation.mutateAsync({
        orderId,
        documentId,
        fallbackFileName:
          targetDocument?.fileName ||
          `${targetDocument?.documentNumber || 'document'}.pdf`,
      });

      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast(
        extractErrorMessage(error, 'Failed to download document.'),
        'error',
      );
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
      const message = extractErrorMessage(
        error,
        'Failed to generate document.',
      );
      const shouldRetryWithForce =
        !force &&
        /already exists|already generated|exists/i.test(message) &&
        window.confirm(
          'A document of this type already exists. Do you want to regenerate it?',
        );

      if (shouldRetryWithForce) {
        await handleGenerate(documentType, true);
        return;
      }

      showToast(message, 'error');
    }
  };

  // Replaces a finished document, so it is confirmed first.
  const handleRegenerate = async (documentType: OrderDocumentType) => {
    if (
      !window.confirm(
        `Regenerate the ${documentLabels[documentType]}? The current file is replaced.`,
      )
    ) {
      return;
    }

    await handleGenerate(documentType, true);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <Loader variant='section' />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {canGenerate && availableGeneratableTypes.length > 0 ? (
        <div className={styles.toolbar}>
          <div className={styles.toolbarCopy}>
            <h4 className={styles.toolbarTitle}>{toolbarTitle}</h4>
            <p className={styles.toolbarDescription}>
              Generate and manage order paperwork.
            </p>
          </div>
          <div className={styles.generateMenu} ref={generateMenuRef}>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                if (isGenerateMenuOpen) {
                  closeGenerateMenu();
                  return;
                }

                setIsGenerateMenuOpen(true);
              }}
              className={styles.generateTrigger}
            >
              Generate document
            </Button>
            {isGenerateMenuOpen ? (
              <div
                className={`${styles.generateDropdown} ${
                  isGenerateMenuVisible ? styles.generateDropdownOpen : ''
                }`}
              >
                {availableGeneratableTypes.map((type) => {
                  const existingDocument = latestDocumentByType.get(type);
                  const isAlreadyGenerated =
                    existingDocument?.status === 'GENERATED';
                  const isPendingGeneration =
                    existingDocument?.status === 'PENDING';

                  return (
                    <button
                      key={type}
                      type='button'
                      className={styles.generateOption}
                      onClick={() => {
                        if (isPendingGeneration) return;
                        if (isAlreadyGenerated && !canForceRegenerate) return;

                        closeGenerateMenu();
                        if (isAlreadyGenerated) {
                          void handleRegenerate(type);
                          return;
                        }
                        void handleGenerate(type);
                      }}
                      disabled={
                        generateMutation.isPending ||
                        (isAlreadyGenerated && !canForceRegenerate) ||
                        isPendingGeneration
                      }
                    >
                      <span className={styles.generateOptionLabel}>
                        {documentLabels[type]}
                      </span>
                      {isAlreadyGenerated ? (
                        <span
                          className={`${styles.generateStateBadge} ${styles.generateStateDone}`}
                        >
                          {canForceRegenerate ? 'Regenerate' : 'Generated'}
                        </span>
                      ) : null}
                      {isPendingGeneration ? (
                        <span
                          className={`${styles.generateStateBadge} ${styles.generateStatePending}`}
                        >
                          In progress
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {availableDocuments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No documents available for this order yet.</p>
        </div>
      ) : (
        <div className={styles.documents}>
          {availableDocuments.map((document) => {
            const isDownloading =
              downloadMutation.isPending &&
              downloadMutation.variables?.documentId === document.id;
            const canGenerateDocument = canShowGenerateAction(document, {
              canGenerate,
              canForceRegenerate,
              canGenerateTypes,
            });
            const shouldForce = canForceRegenerate;

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
                      <p className={styles.errorMessage}>
                        {document.errorMessage}
                      </p>
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

                  {document.status === 'GENERATED' &&
                  canForceRegenerate &&
                  canGenerateDocument ? (
                    <button
                      type='button'
                      className={styles.secondaryAction}
                      onClick={() => handleRegenerate(document.type)}
                      disabled={generateMutation.isPending}
                    >
                      Regenerate
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
      )}
    </div>
  );
};

export { OrderDocuments };
