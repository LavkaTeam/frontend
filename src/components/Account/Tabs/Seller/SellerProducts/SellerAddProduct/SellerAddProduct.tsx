import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { uploadImage } from '@/api/images';

import {
  ProductImageGallery,
  type LocalImage,
} from './ProductImageGallery/ProductImageGallery';
import { ProductForm } from './ProductForm/ProductForm';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import styles from './SellerAddProduct.module.css';

import { productSchema } from '@/schemas/productSchema';
import {
  saveDraftToDB,
  getDraftFromDB,
  clearDraftFromDB,
} from '@/utils/draftStorage';

interface SellerAddProductProps {
  onCancel?: () => void;
  onSave?: (data: any) => void;
}

const DRAFT_KEY = 'current_product_draft';

export const SellerAddProduct = ({ onSave }: SellerAddProductProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    tags: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<LocalImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Стейти для Чернетки (Draft)
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [savedDraft, setSavedDraft] = useState<any>(null);

  // 1. ЗАВАНТАЖЕННЯ ЧЕРНЕТКИ З ІНДЕКСОВАНОЇ БАЗИ
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await getDraftFromDB(DRAFT_KEY);
        if (draft) {
          const hasData =
            Object.entries(draft.formData).some(([key, val]) => {
              if (key === 'tags') return Array.isArray(val) && val.length > 0;
              return typeof val === 'string' && val.trim() !== '';
            }) || draft.images.length > 0;

          if (hasData) {
            setSavedDraft(draft);
            setShowDraftPrompt(true);
          }
        }
      } catch (e) {
        console.error('Failed to load draft from DB', e);
      }
    };
    loadDraft();
  }, []);

  // 2. ЗБЕРЕЖЕННЯ ЧЕРНЕТКИ (Текст + Картинки) ПРИ КОЖНІЙ ЗМІНІ
  useEffect(() => {
    const hasData =
      Object.entries(formData).some(([key, val]) => {
        if (key === 'tags') return Array.isArray(val) && val.length > 0;
        return typeof val === 'string' && val.trim() !== '';
      }) || images.length > 0;

    if (hasData) {
      saveDraftToDB(DRAFT_KEY, { formData, images }).catch(console.error);
    }
  }, [formData, images]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTagsChange = (newTags: string[]) => {
    setFormData((prev) => ({ ...prev, tags: newTags }));
    if (errors.tags) setErrors((prev) => ({ ...prev, tags: '' }));
  };

  // ВІДНОВЛЕННЯ ДАНИХ
  const acceptDraft = () => {
    if (savedDraft) {
      setFormData(savedDraft.formData);
      const restoredImages = savedDraft.images.map((img: LocalImage) => ({
        ...img,
        url: URL.createObjectURL(img.blob),
      }));
      setImages(restoredImages);
    }
    setShowDraftPrompt(false);
  };

  const rejectDraft = async () => {
    await clearDraftFromDB(DRAFT_KEY);
    setSavedDraft(null);
    setShowDraftPrompt(false);
  };

  // ЗАГЛУШКА ДЛЯ ПРЕВ'Ю
  const handlePreviewClick = () => {
    // TODO: Імплементувати повноцінне прев'ю, коли буде готовий бекенд
    alert('Preview mode is coming soon!');
  };

  // ФІНАЛЬНИЙ САБМІТ
  const handleSubmit = async () => {
    const validationResult = productSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (images.length === 0) {
      alert('Please add at least one product photo.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setImages((prev) =>
      prev.map((img) => ({ ...img, status: 'uploading', progress: 0 })),
    );
    const progressInterval = setInterval(() => {
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          progress:
            img.progress < 95
              ? img.progress + Math.floor(Math.random() * 20)
              : 95,
        })),
      );
    }, 300);

    try {
      const uploadPromises = images.map((img) => uploadImage(img.blob));
      const uploadedUrls = await Promise.all(uploadPromises);

      clearInterval(progressInterval);
      setImages((prev) =>
        prev.map((img) => ({ ...img, status: 'success', progress: 100 })),
      );

      await clearDraftFromDB(DRAFT_KEY);

      if (onSave) {
        onSave({
          ...validationResult.data,
          mainImage: uploadedUrls[0],
          thumbnails: uploadedUrls.slice(1),
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      setImages((prev) => prev.map((img) => ({ ...img, status: 'error' })));
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Product</h1>
        <p className={styles.subtitle}>Add product to your catalog.</p>
      </div>

      <div className={styles.contentGrid}>
        <ProductImageGallery
          images={images}
          setImages={setImages}
          isSubmitting={isSubmitting}
        />

        <div className={styles.formContainer}>
          <ProductForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onTagsChange={handleTagsChange}
            isSubmitting={isSubmitting}
          />

          <div className={styles.actionRow}>
            <Button
              variant='secondary'
              onClick={handlePreviewClick}
              style={{ marginRight: '16px' }}
              disabled={isSubmitting}
            >
              Preview
            </Button>

            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Uploading & Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDraftPrompt}
        title='Restore previous data?'
        message='We found unsaved changes from your previous session. Would you like to restore them?'
        confirmText='Restore'
        cancelText='Start Fresh'
        variant='warning'
        onConfirm={acceptDraft}
        onCancel={rejectDraft}
      />
    </div>
  );
};
