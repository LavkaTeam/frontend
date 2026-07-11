import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';

import { uploadImage } from '@/api/images';
import { useProductCategories, useCreateProduct, useSellerProduct, useUpdateProduct } from '@/hooks/useProducts';
import { DEFAULT_ADJUSTMENTS, type EditorConfig } from '@/hooks/useImageEditor';
import { useToast } from '@/hooks/useToast';
import {
  buildProductPayload,
  createEmptyProductForm,
  createWholesaleTier,
  mapProductToFormData,
  validateProductForm,
  type ProductFormData,
  type ProductWholesaleTierFormValue,
} from '@/schemas/productSchema';
import type { ProductImage } from '@/types/productCard';
import { clearDraftFromDB, getDraftFromDB, saveDraftToDB } from '@/utils/draftStorage';
import { extractErrorMessage } from '@/utils/error';

import type { LocalImage } from '../ProductImageGallery/ProductImageGallery';

export type SellerProductEditorMode = 'create' | 'edit';

type DraftPayload = {
  formData: ProductFormData;
  images: LocalImage[];
};

type UseSellerProductEditorOptions = {
  mode: SellerProductEditorMode;
  productId?: string;
  onSuccess?: () => void;
};

const createDefaultEditorConfig = (): EditorConfig => ({
  crop: { x: 0, y: 0 },
  zoom: 1,
  rotation: 0,
  adjustments: DEFAULT_ADJUSTMENTS,
});

const getDraftKey = (mode: SellerProductEditorMode, productId?: string) =>
  mode === 'edit' && productId ? `product_draft_${productId}` : 'product_draft_new';

const hasDraftContent = (draft: DraftPayload | null | undefined) => {
  if (!draft) return false;

  const defaultForm = createEmptyProductForm();
  const hasFormValues = Object.entries(draft.formData).some(([key, value]) => {
    if (key === 'tags' || key === 'wholesalePrices') {
      return Array.isArray(value) && value.length > 0;
    }

    if (key === 'mainCategory' || key === 'minimumOrderQuantity' || key === 'taxRate') {
      return value !== defaultForm[key as keyof ProductFormData];
    }

    return typeof value === 'string' && value.trim() !== '';
  });

  return hasFormValues || draft.images.length > 0;
};

const restoreDraftImages = (images: LocalImage[]) =>
  images.map((image) => ({
    ...image,
    url:
      image.blob instanceof Blob
        ? URL.createObjectURL(image.blob)
        : image.originalBlob instanceof Blob
          ? URL.createObjectURL(image.originalBlob)
          : image.url,
  }));

const createLocalImageFromRemote = async (
  image: ProductImage,
  index: number,
): Promise<LocalImage> => {
  const response = await fetch(image.url);
  if (!response.ok) {
    throw new Error(`Failed to load image: ${image.url}`);
  }

  const blob = await response.blob();
  const extension = blob.type.split('/')[1]?.toUpperCase() || 'JPG';

  return {
    id: image.id,
    url: image.url,
    blob,
    originalBlob: blob,
    editorConfig: createDefaultEditorConfig(),
    name: `Product image ${index + 1}`,
    ext: extension,
    sizeStr: `${Math.max(1, Math.round(blob.size / 1024))} KB`,
    status: 'idle',
    progress: 0,
    uploadedImage: image,
  };
};

const applyDraftState = (
  draft: DraftPayload,
  setFormData: Dispatch<SetStateAction<ProductFormData>>,
  setImages: Dispatch<SetStateAction<LocalImage[]>>,
) => {
  setFormData(draft.formData);
  setImages(restoreDraftImages(draft.images));
};

export const useSellerProductEditor = ({
  mode,
  productId,
  onSuccess,
}: UseSellerProductEditorOptions) => {
  const { showToast } = useToast();
  const isEditMode = mode === 'edit' && Boolean(productId);
  const shouldUseDraft = mode === 'create';
  const draftKey = useMemo(() => getDraftKey(mode, productId), [mode, productId]);
  const { data: product, isLoading: isProductLoading, isError: isProductError } =
    useSellerProduct(isEditMode ? productId : undefined);
  const {
    data: categoryTree = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useProductCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct(productId || '');
  const activeMutation = isEditMode ? updateProductMutation : createProductMutation;
  const [formData, setFormData] = useState<ProductFormData>(createEmptyProductForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<LocalImage[]>([]);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [savedDraft, setSavedDraft] = useState<DraftPayload | null>(null);
  const [fallbackState, setFallbackState] = useState<DraftPayload | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const initializedKeyRef = useRef<string | null>(null);
  const isSubmitting = activeMutation.isPending;

  const clearError = (field: string) => {
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  useEffect(() => {
    let isCancelled = false;

    const initializeForm = async () => {
      const initializationKey = `${mode}:${productId || 'new'}`;
      if (initializedKeyRef.current === initializationKey || (isEditMode && !product)) {
        return;
      }

      try {
        const serverFormData = product ? mapProductToFormData(product) : createEmptyProductForm();
        const serverImages = product
          ? await Promise.all(
              [product.mainImage, ...(product.images || [])]
                .filter(Boolean)
                .map((image, index) => createLocalImageFromRemote(image as ProductImage, index)),
            )
          : [];
        if (isCancelled) return;

        const serverState: DraftPayload = { formData: serverFormData, images: serverImages };
        if (shouldUseDraft) {
          const draft = (await getDraftFromDB(draftKey)) as DraftPayload | null;
          if (isCancelled) return;

          if (hasDraftContent(draft)) {
            setSavedDraft(draft);
            setFallbackState(serverState);
            setShowDraftPrompt(true);
          } else {
            setFormData(serverState.formData);
            setImages(serverState.images);
            setFallbackState(serverState);
          }
        } else {
          setFormData(serverState.formData);
          setImages(serverState.images);
          setFallbackState(serverState);
        }

        initializedKeyRef.current = initializationKey;
        setIsInitialized(true);
      } catch (error) {
        if (!isCancelled) {
          showToast(extractErrorMessage(error, 'Failed to prepare product form.'), 'error');
          initializedKeyRef.current = initializationKey;
          setIsInitialized(true);
        }
      }
    };

    initializeForm();
    return () => {
      isCancelled = true;
    };
  }, [draftKey, isEditMode, mode, product, productId, shouldUseDraft, showToast]);

  useEffect(() => {
    if (!shouldUseDraft || !isInitialized || showDraftPrompt) return;

    const draftPayload: DraftPayload = { formData, images };
    const operation = hasDraftContent(draftPayload)
      ? saveDraftToDB(draftKey, draftPayload)
      : clearDraftFromDB(draftKey);
    operation.catch((error) => {
      console.error('Failed to persist product draft', error);
    });
  }, [draftKey, formData, images, isInitialized, shouldUseDraft, showDraftPrompt]);

  useEffect(() => {
    if (images.length > 0) clearError('images');
  }, [images.length]);

  const handleFieldChange = (field: keyof ProductFormData, value: string | string[]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    clearError(field);
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((previous) => ({ ...previous, tags }));
    clearError('tags');
  };

  const handleAddWholesaleTier = () => {
    setFormData((previous) => ({
      ...previous,
      wholesalePrices: [...previous.wholesalePrices, createWholesaleTier()],
    }));
  };

  const handleWholesaleTierChange = (
    tierId: string,
    field: keyof Pick<ProductWholesaleTierFormValue, 'minQuantity' | 'price'>,
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      wholesalePrices: previous.wholesalePrices.map((tier) =>
        tier.id === tierId ? { ...tier, [field]: value } : tier,
      ),
    }));
    setErrors((previous) => {
      const next = { ...previous };
      Object.keys(previous).forEach((key) => {
        if (key.startsWith('wholesalePrices.')) delete next[key];
      });
      return next;
    });
  };

  const handleRemoveWholesaleTier = (tierId: string) => {
    setFormData((previous) => ({
      ...previous,
      wholesalePrices: previous.wholesalePrices.filter((tier) => tier.id !== tierId),
    }));
  };

  const acceptDraft = () => {
    if (savedDraft) applyDraftState(savedDraft, setFormData, setImages);
    setShowDraftPrompt(false);
    setSavedDraft(null);
  };

  const rejectDraft = async () => {
    await clearDraftFromDB(draftKey);
    if (fallbackState) {
      setFormData(fallbackState.formData);
      setImages(fallbackState.images);
    } else {
      setFormData(createEmptyProductForm());
      setImages([]);
    }
    setSavedDraft(null);
    setShowDraftPrompt(false);
  };

  const uploadPreparedImages = async () => {
    const uploadedImages: ProductImage[] = [];
    for (const image of images) {
      const isExistingUnchanged = Boolean(image.uploadedImage && image.blob && image.originalBlob && image.blob === image.originalBlob);
      if (isExistingUnchanged && image.uploadedImage) {
        uploadedImages.push(image.uploadedImage);
        continue;
      }
      if (!image.blob) throw new Error('One of the images is missing binary data.');

      setImages((previous) => previous.map((item) =>
        item.id === image.id ? { ...item, status: 'uploading', progress: 60 } : item,
      ));
      const uploadedImage = await uploadImage(image.blob);
      uploadedImages.push(uploadedImage);
      setImages((previous) => previous.map((item) =>
        item.id === image.id ? { ...item, status: 'success', progress: 100, uploadedImage } : item,
      ));
    }
    return uploadedImages;
  };

  const handleSubmit = async () => {
    const validationErrors = validateProductForm(formData);
    if (images.length === 0) validationErrors.images = 'Please add at least one product image';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors({});
      setImages((previous) => previous.map((image) => ({ ...image, status: 'idle', progress: 0 })));
      const uploadedImages = await uploadPreparedImages();
      await activeMutation.mutateAsync(buildProductPayload(formData, uploadedImages));
      if (shouldUseDraft) await clearDraftFromDB(draftKey);
      showToast(isEditMode ? 'Product updated successfully.' : 'Product created successfully.', 'success');
      onSuccess?.();
    } catch (error) {
      setImages((previous) => previous.map((image) =>
        image.status === 'uploading' ? { ...image, status: 'error' } : image,
      ));
      showToast(extractErrorMessage(error, 'Failed to save product.'), 'error');
    }
  };

  return {
    categoryTree,
    errors,
    formData,
    handleAddWholesaleTier,
    handleFieldChange,
    handleRemoveWholesaleTier,
    handleSubmit,
    handleTagsChange,
    handleWholesaleTierChange,
    images,
    isEditMode,
    isError: isProductError || isCategoriesError,
    isLoading: isProductLoading || isCategoriesLoading || !isInitialized,
    isSubmitting,
    rejectDraft,
    setImages,
    shouldUseDraft,
    showDraftPrompt,
    acceptDraft,
  };
};
