import Cropper from 'react-easy-crop';
import { UndoIcon } from '@/components/ui/icons/UndoIcon';
import { RedoIcon } from '@/components/ui/icons/RedoIcon';
import { CompareIcon } from '@/components/ui/icons/CompareIcon';
import type { ImageEditorState } from '@/hooks/useImageEditor';
import styles from './EditorSection.module.css';

interface EditorSectionProps {
  imageSrc: string;
  aspectRatio: number;
  editor: ImageEditorState;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
}

export const EditorSection = ({
  imageSrc,
  aspectRatio,
  editor,
  onCropComplete,
}: EditorSectionProps) => {
  const {
    editorTab,
    setEditorTab,
    crop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    adjustments,
    setAdjustments,
    setMediaSize,
    setCropSize,
    // isComparing — used only through setIsComparing below
    setIsComparing,
    hasFiltersChanged,
    isPerfectlyCentered,
    activeAdjustments,
    activeRotation,
    historyIndex,
    historyLength,
    handleCropChange,
    handleZoomChange,
    handleUndo,
    handleRedo,
    commitHistory,
    resetAllColors,
    autoCenter,
  } = editor;

  return (
    <div className={styles.editorSection}>
      <div className={styles.cropperColumn}>
        <div className={styles.cropperWrapper}>
          <div
            className={styles.cropperInner}
            style={{
              filter: `
                brightness(${activeAdjustments.brightness}%) 
                contrast(${activeAdjustments.contrast}%) 
                saturate(${activeAdjustments.saturation}%)
                grayscale(${activeAdjustments.grayscale}%)
                sepia(${activeAdjustments.sepia}%)
                hue-rotate(${activeAdjustments.hueRotate}deg)
                blur(${activeAdjustments.blur}px)
              `,
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={activeRotation}
              aspect={aspectRatio}
              onCropChange={handleCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={handleZoomChange}
              onInteractionEnd={commitHistory}
              onMediaLoaded={setMediaSize}
              onCropSizeChange={setCropSize}
              showGrid={true}
              minZoom={0.1}
              restrictPosition={false}
              zoomSpeed={0.4}
            />
          </div>
        </div>

        <div className={styles.bottomToolbar}>
          <div className={styles.toolbarLeft}>
            <button
              className={styles.toolBtn}
              onClick={handleUndo}
              disabled={historyIndex === 0}
              title='Undo'
            >
              <UndoIcon />
            </button>
            <button
              className={styles.toolBtn}
              onClick={handleRedo}
              disabled={historyIndex === historyLength - 1}
              title='Redo'
            >
              <RedoIcon />
            </button>
          </div>

          <div className={styles.toolbarCenter}>
            {isPerfectlyCentered && (
              <div className={styles.centeredBadge}>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <polyline points='20 6 9 17 4 12'></polyline>
                </svg>
                Perfectly Centered
              </div>
            )}
          </div>

          <div className={styles.toolbarRight}>
            {hasFiltersChanged && (
              <button
                className={styles.compareBtn}
                onPointerDown={() => setIsComparing(true)}
                onPointerUp={() => setIsComparing(false)}
                onPointerLeave={() => setIsComparing(false)}
                title='Hold to see original'
              >
                <CompareIcon /> Compare
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.toolsArea}>
        <div className={styles.editorTabs}>
          <button
            className={editorTab === 'layout' ? styles.activeEditorTab : ''}
            onClick={() => setEditorTab('layout')}
          >
            Position
          </button>
          <button
            className={editorTab === 'adjust' ? styles.activeEditorTab : ''}
            onClick={() => setEditorTab('adjust')}
          >
            Colors
          </button>
        </div>

        <div className={styles.toolsContent}>
          <div key={editorTab} className={styles.animatedTab}>
            {editorTab === 'layout' && (
              <div className={styles.toolGroup}>
                <div className={styles.sliderControl}>
                  <div className={styles.labelRow}>
                    <label>Zoom</label>
                    <div className={styles.labelActions}>
                      <button
                        className={styles.autoCenterLink}
                        onClick={autoCenter}
                      >
                        ⌖ Auto-Center
                      </button>
                      <span>{(zoom * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <input
                    type='range'
                    value={zoom}
                    min={0.1}
                    max={3}
                    step={0.05}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    onPointerUp={commitHistory}
                    className={styles.slider}
                  />
                </div>

                <div className={styles.sliderControl}>
                  <div className={styles.labelRow}>
                    <label>Rotation</label>
                    <span>{rotation}°</span>
                  </div>
                  <input
                    type='range'
                    value={rotation}
                    min={0}
                    max={360}
                    step={1}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    onPointerUp={commitHistory}
                    className={styles.slider}
                  />
                </div>

                <div className={styles.aiDivider}></div>
                <div className={styles.aiSection}>
                  <div className={styles.aiBtn}>
                    ✨ AI Background{' '}
                    <span className={styles.aiBadge}>Coming Soon</span>
                  </div>
                </div>
              </div>
            )}

            {editorTab === 'adjust' && (
              <div className={styles.toolGroupAlt}>
                <div className={styles.sliderControl}>
                  <label>Brightness</label>
                  <input
                    type='range'
                    min={0}
                    max={200}
                    value={adjustments.brightness}
                    className={styles.slider}
                    onChange={(e) =>
                      setAdjustments((p) => ({
                        ...p,
                        brightness: Number(e.target.value),
                      }))
                    }
                    onPointerUp={commitHistory}
                  />
                </div>
                <div className={styles.sliderControl}>
                  <label>Contrast</label>
                  <input
                    type='range'
                    min={0}
                    max={200}
                    value={adjustments.contrast}
                    className={styles.slider}
                    onChange={(e) =>
                      setAdjustments((p) => ({
                        ...p,
                        contrast: Number(e.target.value),
                      }))
                    }
                    onPointerUp={commitHistory}
                  />
                </div>
                <div className={styles.sliderControl}>
                  <label>Saturation</label>
                  <input
                    type='range'
                    min={0}
                    max={200}
                    value={adjustments.saturation}
                    className={styles.slider}
                    onChange={(e) =>
                      setAdjustments((p) => ({
                        ...p,
                        saturation: Number(e.target.value),
                      }))
                    }
                    onPointerUp={commitHistory}
                  />
                </div>
                <div className={styles.sliderControl}>
                  <label>Hue (Color Tone)</label>
                  <input
                    type='range'
                    min={0}
                    max={360}
                    value={adjustments.hueRotate}
                    className={styles.slider}
                    onChange={(e) =>
                      setAdjustments((p) => ({
                        ...p,
                        hueRotate: Number(e.target.value),
                      }))
                    }
                    onPointerUp={commitHistory}
                  />
                </div>
                <div className={styles.sliderControl}>
                  <label>Temperature (Sepia)</label>
                  <input
                    type='range'
                    min={0}
                    max={100}
                    value={adjustments.sepia}
                    className={styles.slider}
                    onChange={(e) =>
                      setAdjustments((p) => ({
                        ...p,
                        sepia: Number(e.target.value),
                      }))
                    }
                    onPointerUp={commitHistory}
                  />
                </div>
                <button className={styles.resetBtn} onClick={resetAllColors}>
                  Reset All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
