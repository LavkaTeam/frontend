import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FolderIcon } from '@/components/ui/icons/FolderIcon';
import { LinkIcon } from '@/components/ui/icons/LinkIcon';
import { CameraIcon } from '@/components/ui/icons/CameraIcon';
import type { TabType } from '@/hooks/useImageEditor';
import styles from './UploadSection.module.css';

interface UploadSectionProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  urlInput: string;
  setUrlInput: (val: string) => void;
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDrop: (file: File) => void;
  onUrlLoad: () => void;
}

export const UploadSection = ({
  activeTab,
  setActiveTab,
  urlInput,
  setUrlInput,
  isDragging,
  setIsDragging,
  isLoading,
  fileInputRef,
  cameraInputRef,
  onFileChange,
  onFileDrop,
  onUrlLoad,
}: UploadSectionProps) => {
  return (
    <div className={styles.uploadSection}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'file' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('file')}
        >
          <FolderIcon /> File / Paste
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'url' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('url')}
        >
          <LinkIcon /> URL
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'camera' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          <CameraIcon /> Camera
        </button>
      </div>

      <div className={styles.uploadBoxContainer}>
        <div key={activeTab} className={styles.animatedTab}>
          {activeTab === 'file' && (
            <div
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files[0])
                  onFileDrop(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type='file'
                accept='image/*'
                className={styles.hiddenInput}
                ref={fileInputRef}
                onChange={onFileChange}
              />
              <div className={styles.iconPlaceholder}>
                <FolderIcon />
              </div>
              <h4 className={styles.dropZoneTitle}>Click or Drag & Drop</h4>
              <p className={styles.dropZoneSub}>SVG, PNG, JPG (max 5MB)</p>
              <div className={styles.shortcutBadge}>
                Cmd+V to paste image directly
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className={styles.urlCard}>
              <div className={styles.iconPlaceholder}>
                <LinkIcon />
              </div>
              <h4 className={styles.cardTitle}>Import from Web</h4>
              <p className={styles.cardSub}>
                Paste a direct link to an image file
              </p>
              <div className={styles.urlInputGroup}>
                <div className={styles.urlInputWrapper}>
                  <Input
                    placeholder='https://example.com/image.jpg'
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
                <div className={styles.urlButtonWrapper}>
                  <Button onClick={onUrlLoad} disabled={!urlInput || isLoading}>
                    {isLoading ? 'Loading...' : 'Load'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className={styles.cameraCard}>
              <div className={styles.cameraIconWrapper}>
                <CameraIcon />
              </div>
              <h4 className={styles.cardTitle}>Take a Photo</h4>
              <p className={styles.cardSub}>
                Use your device's camera to capture a product directly.
              </p>
              <div className={styles.cameraBtnWrapper}>
                <Button onClick={() => cameraInputRef.current?.click()}>
                  Open Camera
                </Button>
              </div>
              <input
                type='file'
                accept='image/*'
                capture='environment'
                className={styles.hiddenInput}
                ref={cameraInputRef}
                onChange={onFileChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
