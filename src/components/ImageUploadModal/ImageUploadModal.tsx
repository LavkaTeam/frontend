import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { getCroppedImg } from '@/utils/canvasUtils';

import {
  useImageEditor,
  type TabType,
  type EditorConfig,
} from '@/hooks/useImageEditor';
import { UploadSection } from './UploadSection/UploadSection';
import { EditorSection } from './EditorSection/EditorSection';
import styles from './ImageUploadModal.module.css';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (
    croppedBlob: Blob,
    originalBlob: Blob,
    config: EditorConfig,
  ) => Promise<void>;
  aspectRatio?: number;
  title?: string;
  initialOriginalBlob?: Blob | null;
  initialConfig?: EditorConfig | null;
}

export const ImageUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  aspectRatio = 1,
  title = 'Upload Product Image',
  initialOriginalBlob = null,
  initialConfig = null,
}: ImageUploadModalProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('file');

  const [originalBlob, setOriginalBlob] = useState<Blob | null>(
    initialOriginalBlob,
  );
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const editor = useImageEditor(initialConfig);
  const { resetEditor } = editor;

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'error') =>
      setToast({ message, type }),
    [],
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file (JPG, PNG, WebP).');
        return;
      }
      setOriginalBlob(file);
      setImageSrc(URL.createObjectURL(file));
    },
    [showToast],
  );

  // ФІКС: Контроль стану при кожному ВІДКРИТТІ модалки
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      if (initialOriginalBlob) {
        // Якщо ми редагуємо - ставимо існуючий файл
        setOriginalBlob(initialOriginalBlob);
        setImageSrc(URL.createObjectURL(initialOriginalBlob));
      } else {
        // Якщо додаємо нове - очищуємо все від попередньої сесії
        setImageSrc(null);
        setOriginalBlob(null);
        resetEditor();
      }
    } else if (shouldRender) {
      setIsVisible(false);
    }
  }, [initialOriginalBlob, isOpen, resetEditor, shouldRender]);

  useEffect(() => {
    if (!shouldRender || !isOpen) return;

    const openTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 16);

    return () => window.clearTimeout(openTimer);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') requestClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [shouldRender]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!shouldRender || imageSrc) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const file = item.getAsFile();
          if (file) handleFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFile, imageSrc, shouldRender]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0)
      handleFile(e.target.files[0]);
  };

  const handleUrlLoad = async () => {
    if (!urlInput) return;
    setIsLoading(true);
    try {
      const res = await fetch(urlInput);
      const blob = await res.blob();
      setOriginalBlob(blob);
      setImageSrc(URL.createObjectURL(blob));
    } catch {
      showToast('Cannot load image. The URL is invalid or blocked by CORS.');
    } finally {
      setIsLoading(false);
    }
  };

  const onCropComplete = useCallback(
    (
      _: { x: number; y: number; width: number; height: number },
      croppedPixels: { x: number; y: number; width: number; height: number },
    ) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsLoading(true);
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        editor.rotation,
        editor.adjustments,
        'image/jpeg',
      );
      if (croppedBlob) {
        const finalOriginalBlob = originalBlob || croppedBlob;
        await onUpload(croppedBlob, finalOriginalBlob, editor.currentConfig);
        requestClose();
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to process image.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetContent = () => {
    setImageSrc(null);
    setOriginalBlob(null);
    setUrlInput('');
    resetEditor();
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const requestClose = () => {
    setIsVisible(false);
  };

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (
      event.target === event.currentTarget &&
      event.propertyName === 'opacity' &&
      !isVisible
    ) {
      resetContent();
      setShouldRender(false);
      onClose();
    }
  };

  if (!shouldRender) return null;

  return createPortal(
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className={`${styles.modalOverlay} ${isVisible ? styles.open : ''}`}
        onClick={requestClose}
        onTransitionEnd={handleTransitionEnd}
        role='dialog'
        aria-modal='true'
      >
        <div
          className={`${styles.modalContent} ${isVisible ? styles.open : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>{imageSrc ? 'Edit Image' : title}</h3>
            <button
              onClick={requestClose}
              className={styles.closeBtn}
              aria-label='Close modal'
            >
              ✕
            </button>
          </div>

          <div className={styles.body}>
            {!imageSrc ? (
              <UploadSection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                urlInput={urlInput}
                setUrlInput={setUrlInput}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                isLoading={isLoading}
                fileInputRef={fileInputRef}
                cameraInputRef={cameraInputRef}
                onFileChange={onFileChange}
                onFileDrop={handleFile}
                onUrlLoad={handleUrlLoad}
              />
            ) : (
              <EditorSection
                imageSrc={imageSrc}
                aspectRatio={aspectRatio}
                editor={editor}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className={styles.footer}>
            <Button
              variant='secondary'
              onClick={() => (imageSrc ? setImageSrc(null) : requestClose())}
              disabled={isLoading}
            >
              {imageSrc ? 'Back to Upload' : 'Cancel'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!imageSrc || isLoading}
              isLoading={isLoading}
            >
              {isLoading ? 'Processing...' : 'Apply & Save'}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};
