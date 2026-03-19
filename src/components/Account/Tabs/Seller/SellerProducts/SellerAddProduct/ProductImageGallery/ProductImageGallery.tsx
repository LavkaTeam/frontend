import { useState, useRef } from 'react';
import { ImageUploadModal } from '@/components/ImageUploadModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { EditProductIcon } from '@/components/ui/icons/EditProductIcon';
import { UploadIcon } from '@/components/ui/icons/UploadIcon';
import { BigImageIcon } from '@/components/ui/icons/BigImageIcon';
import { DragHandleIcon } from '@/components/ui/icons/DragHandleIcon';

import type { EditorConfig } from '@/hooks/useImageEditor';
import styles from './ProductImageGallery.module.css';

export interface LocalImage {
  id: string;
  url: string;
  blob: Blob;
  originalBlob: Blob; // ОРИГІНАЛ
  editorConfig: EditorConfig; // ЗБЕРЕЖЕНІ НАЛАШТУВАННЯ
  name: string;
  ext: string;
  sizeStr: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
}

interface ProductImageGalleryProps {
  images: LocalImage[];
  setImages: React.Dispatch<React.SetStateAction<LocalImage[]>>;
  isSubmitting: boolean;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  return parseFloat((bytes / k).toFixed(0)) + ' KB';
};

const MAX_IMAGES = 10;

export const ProductImageGallery = ({
  images,
  setImages,
  isSubmitting,
}: ProductImageGalleryProps) => {
  const [previewImageId, setPreviewImageId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<LocalImage | null>(null);

  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const isDragHandleHovered = useRef<boolean>(false);

  const handleOpenAddPhoto = () => {
    setEditingImage(null);
    setIsModalOpen(true);
  };

  const handleOpenEditPhoto = (img: LocalImage, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingImage(img);
    setIsModalOpen(true);
  };

  const handleTrashClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageToDelete(id);
  };

  const confirmDelete = () => {
    if (!imageToDelete) return;
    setImages((prev) => {
      const newImages = prev.filter((img) => img.id !== imageToDelete);
      if (imageToDelete === previewImageId) setPreviewImageId(null);
      return newImages;
    });
    setImageToDelete(null);
  };

  const handleMakeMain = (id: string) => {
    setImages((prev) => {
      const idx = prev.findIndex((img) => img.id === id);
      if (idx <= 0) return prev;
      const newArr = [...prev];
      const [item] = newArr.splice(idx, 1);
      newArr.unshift(item);
      return newArr;
    });
    setPreviewImageId(id);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isDragHandleHovered.current) {
      e.preventDefault();
      return;
    }
    dragItemIndex.current = index;
    setTimeout(() => {
      if (e.target instanceof HTMLElement)
        e.target.classList.add(styles.dragging);
    }, 0);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const dragIndex = dragItemIndex.current;
    if (dragIndex === null || dragIndex === index) return;

    setImages((prev) => {
      const newArr = [...prev];
      const draggedItem = newArr[dragIndex];
      newArr.splice(dragIndex, 1);
      newArr.splice(index, 0, draggedItem);
      return newArr;
    });
    dragItemIndex.current = index;
  };

  const handleDragEnd = (e: React.DragEvent) => {
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    isDragHandleHovered.current = false;
    if (e.target instanceof HTMLElement)
      e.target.classList.remove(styles.dragging);
  };

  // Оновлено: Приймаємо 3 параметри з модалки
  const handleModalUpload = async (
    croppedBlob: Blob,
    originalBlob: Blob,
    config: EditorConfig,
  ) => {
    const newUrl = URL.createObjectURL(croppedBlob);
    const sizeStr = formatBytes(croppedBlob.size);
    const newId = Date.now().toString();

    if (editingImage) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id
            ? {
                ...img,
                url: newUrl,
                blob: croppedBlob,
                originalBlob,
                editorConfig: config,
                sizeStr,
              }
            : img,
        ),
      );
    } else {
      const newImage: LocalImage = {
        id: newId,
        url: newUrl,
        blob: croppedBlob,
        originalBlob,
        editorConfig: config,
        name: `Product_img_${images.length + 1}`,
        ext: 'JPEG',
        sizeStr,
        status: 'idle',
        progress: 0,
      };
      setImages((prev) => {
        const updated = [...prev, newImage];
        if (updated.length === 1) setPreviewImageId(newId);
        return updated;
      });
    }
    setIsModalOpen(false);
  };

  const mainDisplayImage =
    images.find((img) => img.id === previewImageId) || images[0];

  return (
    <div className={styles.leftCol}>
      {images.length === 0 ? (
        <div className={styles.largeDropzone} onClick={handleOpenAddPhoto}>
          <BigImageIcon />
          <p className={styles.dropzoneText}>
            <UploadIcon />
            <span>
              Drop your files here/ or{' '}
              <span className={styles.browseText}>Browse</span>
            </span>
          </p>
        </div>
      ) : (
        <div className={styles.filledStateContainer}>
          <div className={styles.mainPhotoPreview}>
            <img
              src={mainDisplayImage.url}
              alt='Main Preview'
              draggable={false}
            />
            {mainDisplayImage.id === images[0].id ? (
              <div className={styles.mainPhotoBadge}>Main Photo</div>
            ) : (
              <button
                className={styles.setAsMainBtn}
                onClick={() => handleMakeMain(mainDisplayImage.id)}
              >
                Set as Main
              </button>
            )}
          </div>

          <div className={styles.fileList}>
            {images.map((img, index) => {
              const isMain = index === 0;
              const isPreviewing = img.id === mainDisplayImage.id;

              return (
                <div
                  key={img.id}
                  className={`${styles.fileCard} ${img.status === 'uploading' ? styles.cardUploading : ''} ${isPreviewing ? styles.cardActive : ''}`}
                  onClick={() => setPreviewImageId(img.id)}
                  draggable={!isSubmitting}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div
                    className={styles.dragHandle}
                    onMouseEnter={() => (isDragHandleHovered.current = true)}
                    onMouseLeave={() => (isDragHandleHovered.current = false)}
                  >
                    <DragHandleIcon />
                  </div>

                  <div className={styles.thumbnailBox}>
                    {img.status === 'uploading' ? (
                      <UploadIcon />
                    ) : (
                      <img src={img.url} alt={img.name} draggable={false} />
                    )}
                  </div>

                  <div className={styles.fileInfo}>
                    <div className={styles.fileTitleRow}>
                      <span className={styles.fileName}>{img.name}</span>
                      {isMain && (
                        <span className={styles.miniMainBadge}>Main</span>
                      )}
                    </div>

                    {img.status === 'uploading' ? (
                      <div className={styles.uploadingState}>
                        <div className={styles.progressTrack}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${img.progress}%` }}
                          ></div>
                        </div>
                        <div className={styles.progressTextRow}>
                          <span>{img.progress}%</span>
                          <span>{img.sizeStr}/sec</span>
                        </div>
                      </div>
                    ) : (
                      <span className={styles.fileMeta}>
                        {img.sizeStr} &bull; {img.ext}
                      </span>
                    )}
                  </div>

                  {!isSubmitting && (
                    <div className={styles.cardActions}>
                      <button
                        className={styles.iconBtn}
                        onClick={(e) => handleOpenEditPhoto(img, e)}
                        title='Edit'
                      >
                        <EditProductIcon
                          color='var(--color-gray-700)'
                          strokeWidth='1.5'
                        />
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.actionBtnDel}`}
                        onClick={(e) => handleTrashClick(img.id, e)}
                        title='Delete'
                      >
                        <TrashIcon color='var(--color-gray-700)' />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {images.length < MAX_IMAGES && (
              <div className={styles.addMoreCard} onClick={handleOpenAddPhoto}>
                <div className={styles.uploadCloudWrapper}>
                  <UploadIcon />
                </div>
                <span className={styles.addMoreText}>Upload another photo</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Передаємо ОРИГІНАЛ ТА КОНФІГ у модалку */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleModalUpload}
        aspectRatio={1}
        initialOriginalBlob={editingImage?.originalBlob || null}
        initialConfig={editingImage?.editorConfig || null}
      />

      <ConfirmModal
        isOpen={!!imageToDelete}
        title='Delete Photo?'
        message='Are you sure you want to remove this photo? You will need to upload it again if you change your mind.'
        confirmText='Delete'
        cancelText='Keep'
        variant='danger'
        onConfirm={confirmDelete}
        onCancel={() => setImageToDelete(null)}
      />
    </div>
  );
};
