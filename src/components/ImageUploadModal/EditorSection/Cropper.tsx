import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';

type CropPoint = {
  x: number;
  y: number;
};

type CropArea = CropPoint & {
  width: number;
  height: number;
};

type MediaSize = {
  width: number;
  height: number;
};

type CropperProps = {
  image: string;
  crop: CropPoint;
  zoom: number;
  rotation: number;
  aspect: number;
  onCropChange: (crop: CropPoint) => void;
  onCropComplete: (croppedArea: CropArea, croppedAreaPixels: CropArea) => void;
  onZoomChange: (zoom: number) => void;
  onInteractionEnd?: () => void;
  onMediaLoaded?: (mediaSize: MediaSize) => void;
  onCropSizeChange?: (cropSize: MediaSize) => void;
  showGrid?: boolean;
  minZoom?: number;
  restrictPosition?: boolean;
  zoomSpeed?: number;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

const Cropper = ({
  image,
  crop,
  zoom,
  rotation,
  aspect,
  onCropChange,
  onCropComplete,
  onZoomChange,
  onInteractionEnd,
  onMediaLoaded,
  onCropSizeChange,
  showGrid = true,
  minZoom = 1,
  restrictPosition = false,
  zoomSpeed = 0.4,
}: CropperProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startCropX: number;
    startCropY: number;
  } | null>(null);
  const [cropSize, setCropSize] = useState<MediaSize | null>(null);
  const [mediaSize, setMediaSize] = useState<MediaSize | null>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateCropSize = () => {
      const rect = wrapper.getBoundingClientRect();
      const nextCropSize = {
        width: rect.width,
        height: rect.height,
      };

      setCropSize(nextCropSize);
      onCropSizeChange?.(nextCropSize);
    };

    updateCropSize();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(updateCropSize);
    observer.observe(wrapper);

    return () => observer.disconnect();
  }, [onCropSizeChange, aspect]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const nextMediaSize = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      };

      setMediaSize(nextMediaSize);
      onMediaLoaded?.(nextMediaSize);
    };
    img.src = image;
  }, [image, onMediaLoaded]);

  useEffect(() => {
    if (!mediaSize || !cropSize) {
      return;
    }

    const rotated = rotateSize(mediaSize.width, mediaSize.height, rotation);
    const cropArea = {
      width: rotated.width / zoom,
      height: rotated.height / zoom,
    };
    const cropAreaPixels = {
      x: clamp(
        rotated.width / 2 - cropArea.width / 2 - crop.x / zoom,
        0,
        Math.max(rotated.width - cropArea.width, 0),
      ),
      y: clamp(
        rotated.height / 2 - cropArea.height / 2 - crop.y / zoom,
        0,
        Math.max(rotated.height - cropArea.height, 0),
      ),
      width: cropArea.width,
      height: cropArea.height,
    };

    onCropComplete(
      {
        x: cropAreaPixels.x,
        y: cropAreaPixels.y,
        width: cropAreaPixels.width,
        height: cropAreaPixels.height,
      },
      cropAreaPixels,
    );
  }, [crop, cropSize, mediaSize, onCropComplete, rotation, zoom]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startCropX: crop.x,
      startCropY: crop.y,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    onCropChange({
      x: dragState.startCropX + (event.clientX - dragState.startX),
      y: dragState.startCropY + (event.clientY - dragState.startY),
    });
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current = null;
    onInteractionEnd?.();
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    const nextZoom = clamp(
      zoom + (event.deltaY < 0 ? zoomSpeed : -zoomSpeed),
      minZoom,
      3,
    );

    onZoomChange(nextZoom);
    onInteractionEnd?.();
  };

  const rotatedSize = mediaSize
    ? rotateSize(mediaSize.width, mediaSize.height, rotation)
    : null;
  const imageWidth = rotatedSize ? rotatedSize.width * zoom : 0;
  const imageHeight = rotatedSize ? rotatedSize.height * zoom : 0;
  const imageLeft = cropSize ? cropSize.width / 2 + crop.x : 0;
  const imageTop = cropSize ? cropSize.height / 2 + crop.y : 0;

  const maxOffsetX = cropSize && rotatedSize
    ? Math.max((imageWidth - cropSize.width) / 2, 0)
    : 0;
  const maxOffsetY = cropSize && rotatedSize
    ? Math.max((imageHeight - cropSize.height) / 2, 0)
    : 0;

  const constrainedLeft =
    restrictPosition && cropSize ? clamp(imageLeft, -maxOffsetX, maxOffsetX) : imageLeft;
  const constrainedTop =
    restrictPosition && cropSize ? clamp(imageTop, -maxOffsetY, maxOffsetY) : imageTop;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        touchAction: 'none',
        cursor: dragStateRef.current ? 'grabbing' : 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {showGrid ? (
        <div
          aria-hidden='true'
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <img
        ref={imageRef}
        src={image}
        alt=''
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: imageWidth || 'auto',
          height: imageHeight || 'auto',
          transform: `translate(calc(-50% + ${constrainedLeft}px), calc(-50% + ${constrainedTop}px)) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Cropper;
