import { useState, useCallback, useRef, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<TabType>('file');

  const [originalBlob, setOriginalBlob] = useState<Blob | null>(
    initialOriginalBlob,
  );
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const editor = useImageEditor(initialConfig);

  // ФІКС: Контроль стану при кожному ВІДКРИТТІ модалки
  useEffect(() => {
    if (isOpen) {
      if (initialOriginalBlob) {
        // Якщо ми редагуємо - ставимо існуючий файл
        setOriginalBlob(initialOriginalBlob);
        setImageSrc(URL.createObjectURL(initialOriginalBlob));
      } else {
        // Якщо додаємо нове - очищуємо все від попередньої сесії
        setImageSrc(null);
        setOriginalBlob(null);
        editor.resetEditor();
      }
    }
  }, [isOpen, initialOriginalBlob]);

  const showToast = (message: string, type: 'success' | 'error' = 'error') =>
    setToast({ message, type });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleReset();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isOpen || imageSrc) return;
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
  }, [isOpen, imageSrc]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    setOriginalBlob(file);
    setImageSrc(URL.createObjectURL(file));
  };

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
    } catch (error) {
      showToast('Cannot load image. The URL is invalid or blocked by CORS.');
    } finally {
      setIsLoading(false);
    }
  };

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

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
        handleReset();
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to process image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setOriginalBlob(null);
    setUrlInput('');
    editor.resetEditor();
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className={styles.modalOverlay}
        onClick={handleReset}
        role='dialog'
        aria-modal='true'
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>{imageSrc ? 'Edit Image' : title}</h3>
            <button
              onClick={handleReset}
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
              onClick={() => (imageSrc ? setImageSrc(null) : handleReset())}
              disabled={isLoading}
            >
              {imageSrc ? 'Back to Upload' : 'Cancel'}
            </Button>
            <Button onClick={handleSave} disabled={!imageSrc || isLoading}>
              {isLoading ? 'Processing...' : 'Apply & Save'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
