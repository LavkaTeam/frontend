import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ImageAdjustments } from '@/utils/canvasUtils';

export type TabType = 'file' | 'url' | 'camera';
export type EditorTabType = 'layout' | 'adjust';

export interface EditorConfig {
  crop: { x: number; y: number };
  zoom: number;
  rotation: number;
  adjustments: ImageAdjustments;
}

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
};

export const useImageEditor = (initialConfig?: EditorConfig | null) => {
  const [editorTab, setEditorTab] = useState<EditorTabType>('layout');

  const [crop, setCrop] = useState(initialConfig?.crop || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialConfig?.zoom || 1);
  const [rotation, setRotation] = useState(initialConfig?.rotation || 0);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(
    initialConfig?.adjustments || DEFAULT_ADJUSTMENTS,
  );

  const [mediaSize, setMediaSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [cropSize, setCropSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [history, setHistory] = useState([
    {
      adjustments: initialConfig?.adjustments || DEFAULT_ADJUSTMENTS,
      rotation: initialConfig?.rotation || 0,
      crop: initialConfig?.crop || { x: 0, y: 0 },
      zoom: initialConfig?.zoom || 1,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isComparing, setIsComparing] = useState(false);

  // ФІКС: Примусово оновлюємо стейт, якщо користувач клікнув "Редагувати" на іншому фото
  useEffect(() => {
    if (initialConfig) {
      setCrop(initialConfig.crop);
      setZoom(initialConfig.zoom);
      setRotation(initialConfig.rotation);
      setAdjustments(initialConfig.adjustments);

      // Скидаємо історію до цього початкового стану
      setHistory([
        {
          adjustments: initialConfig.adjustments,
          rotation: initialConfig.rotation,
          crop: initialConfig.crop,
          zoom: initialConfig.zoom,
        },
      ]);
      setHistoryIndex(0);
    }
  }, [initialConfig]);

  const hasFiltersChanged = useMemo(() => {
    return JSON.stringify(adjustments) !== JSON.stringify(DEFAULT_ADJUSTMENTS);
  }, [adjustments]);

  const activeAdjustments = isComparing ? DEFAULT_ADJUSTMENTS : adjustments;
  const activeRotation = isComparing ? 0 : rotation;
  const isPerfectlyCentered = crop.x === 0 && crop.y === 0;

  const handleMediaLoaded = useCallback(
    (mediaSize: { width: number; height: number }) => {
      setMediaSize(mediaSize);

      // Авто-зум застосовуємо ТІЛЬКИ для нових фотографій.
      // Якщо фото редагується (є initialConfig), ми залишаємо той зум, який юзер зберіг раніше.
      if (!initialConfig) {
        const aspect = mediaSize.width / mediaSize.height;
        if (aspect < 0.8) {
          setZoom(1.5);
        } else if (aspect > 1.2) {
          setZoom(1.2);
        } else {
          setZoom(1);
        }
      }
    },
    [initialConfig],
  );

  const commitHistory = () => {
    const newState = {
      adjustments: { ...adjustments },
      rotation,
      crop: { ...crop },
      zoom,
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleCropChange = (newCrop: { x: number; y: number }) => {
    let x = newCrop.x;
    let y = newCrop.y;
    const SNAP_THRESHOLD = 15;
    if (Math.abs(x) < SNAP_THRESHOLD) x = 0;
    if (Math.abs(y) < SNAP_THRESHOLD) y = 0;

    if (mediaSize && cropSize) {
      const maxOffsetX = (mediaSize.width * zoom - cropSize.width) / 2;
      const maxOffsetY = (mediaSize.height * zoom - cropSize.height) / 2;
      if (Math.abs(x - maxOffsetX) < SNAP_THRESHOLD) x = maxOffsetX;
      if (Math.abs(x + maxOffsetX) < SNAP_THRESHOLD) x = -maxOffsetX;
      if (Math.abs(y - maxOffsetY) < SNAP_THRESHOLD) y = maxOffsetY;
      if (Math.abs(y + maxOffsetY) < SNAP_THRESHOLD) y = -maxOffsetY;
    }
    setCrop({ x, y });
  };

  const handleZoomChange = (newZoom: number) => {
    let finalZoom = newZoom;
    if (mediaSize && cropSize) {
      const fitWidthZoom = cropSize.width / mediaSize.width;
      const fitHeightZoom = cropSize.height / mediaSize.height;
      const SNAP_ZOOM_THRESHOLD = 0.04;
      if (Math.abs(newZoom - fitWidthZoom) < SNAP_ZOOM_THRESHOLD)
        finalZoom = fitWidthZoom;
      else if (Math.abs(newZoom - fitHeightZoom) < SNAP_ZOOM_THRESHOLD)
        finalZoom = fitHeightZoom;
    }
    setZoom(finalZoom);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setAdjustments(history[newIndex].adjustments);
      setRotation(history[newIndex].rotation);
      setCrop(history[newIndex].crop);
      setZoom(history[newIndex].zoom);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setAdjustments(history[newIndex].adjustments);
      setRotation(history[newIndex].rotation);
      setCrop(history[newIndex].crop);
      setZoom(history[newIndex].zoom);
    }
  };

  const resetEditor = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setHistory([
      {
        adjustments: DEFAULT_ADJUSTMENTS,
        rotation: 0,
        crop: { x: 0, y: 0 },
        zoom: 1,
      },
    ]);
    setHistoryIndex(0);
    setEditorTab('layout');
  };

  const autoCenter = () => {
    setCrop({ x: 0, y: 0 });
    setTimeout(commitHistory, 10);
  };
  const resetAllColors = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setRotation(0);
    setTimeout(commitHistory, 10);
  };

  const currentConfig: EditorConfig = { crop, zoom, rotation, adjustments };

  return {
    editorTab,
    setEditorTab,
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    adjustments,
    setAdjustments,
    setMediaSize,
    setCropSize,
    isComparing,
    setIsComparing,
    hasFiltersChanged,
    isPerfectlyCentered,
    activeAdjustments,
    activeRotation,
    historyIndex,
    historyLength: history.length,
    handleCropChange,
    handleZoomChange,
    handleUndo,
    handleRedo,
    commitHistory,
    resetEditor,
    autoCenter,
    resetAllColors,
    currentConfig,
    handleMediaLoaded,
  };
};

export type ImageEditorState = ReturnType<typeof useImageEditor>;
