import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

import { ProductImageGallery } from './ProductImageGallery/ProductImageGallery';
import { ProductForm } from './ProductForm/ProductForm';
import {
  useSellerProductEditor,
  type SellerProductEditorMode,
} from './model/useSellerProductEditor';
import { SellerAddProductSkeleton } from './skeleton';
import styles from './SellerAddProduct.module.css';

interface SellerAddProductProps {
  mode: SellerProductEditorMode;
  productId?: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const SellerAddProduct = ({
  mode,
  productId,
  onCancel,
  onSuccess,
}: SellerAddProductProps) => {
  const editor = useSellerProductEditor({ mode, productId, onSuccess });
  const pageTitle = editor.isEditMode ? 'Edit Product' : 'Add Product';
  const pageSubtitle = editor.isEditMode
    ? 'Update pricing, stock, metadata and images for this product.'
    : 'Create a product card with complete pricing and inventory settings.';

  if (editor.isLoading) {
    return <SellerAddProductSkeleton />;
  }

  if (editor.isError) {
    return (
      <div className={styles.feedbackState}>
        <h3>Failed to load product form</h3>
        <p>Try refreshing the page and open the editor again.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{pageTitle}</h1>
          <p className={styles.subtitle}>{pageSubtitle}</p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type='button'
            variant='secondary'
            className={styles.actionButton}
            onClick={onCancel}
            disabled={editor.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='button'
            className={styles.actionButton}
            onClick={editor.handleSubmit}
            isLoading={editor.isSubmitting}
          >
            {editor.isEditMode ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </div>

      {editor.moderation ? (
        <div
          className={`${styles.moderationBanner} ${
            editor.moderation.kind === 'UNDER_REVIEW'
              ? styles.moderationBannerPending
              : ''
          }`}
          role='status'
        >
          <span className={styles.moderationIcon} aria-hidden='true'>
            {editor.moderation.kind === 'UNDER_REVIEW' ? '…' : '!'}
          </span>
          <div>
            <p className={styles.moderationTitle}>{editor.moderation.title}</p>
            {editor.moderation.reason ? (
              <p className={styles.moderationReason}>
                Reason: {editor.moderation.reason}
              </p>
            ) : null}
            <p className={styles.moderationText}>{editor.moderation.text}</p>
          </div>
        </div>
      ) : null}

      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          <ProductImageGallery
            images={editor.images}
            setImages={editor.setImages}
            isSubmitting={editor.isSubmitting}
          />
          {editor.errors.images ? (
            <span className={styles.imageError}>{editor.errors.images}</span>
          ) : null}
        </div>

        <div className={styles.rightCol}>
          <ProductForm
            formData={editor.formData}
            errors={editor.errors}
            categoryTree={editor.categoryTree}
            onFieldChange={editor.handleFieldChange}
            onTagsChange={editor.handleTagsChange}
            onAddWholesaleTier={editor.handleAddWholesaleTier}
            onWholesaleTierChange={editor.handleWholesaleTierChange}
            onRemoveWholesaleTier={editor.handleRemoveWholesaleTier}
            isSubmitting={editor.isSubmitting}
          />
        </div>
      </div>

      {editor.shouldUseDraft ? (
        <ConfirmModal
          isOpen={editor.showDraftPrompt}
          title='Restore saved draft?'
          message='Unsaved product changes were found for this form. You can restore them or continue with the latest backend data.'
          confirmText='Restore draft'
          cancelText='Use latest data'
          variant='warning'
          onConfirm={editor.acceptDraft}
          onCancel={editor.rejectDraft}
        />
      ) : null}
    </div>
  );
};
