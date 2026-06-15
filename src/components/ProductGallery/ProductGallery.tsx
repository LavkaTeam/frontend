import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ArrowButton } from '@/components/ui/icons/ArrowButton';
import styles from './ProductGallery.module.css';

interface ProductImage {
  url: string;
}
interface ProductGalleryProps {
  mainImage: ProductImage | null;
  additionalImages: ProductImage[];
  altText: string;
}

const ProductGallery = ({
  mainImage,
  additionalImages,
  altText,
}: ProductGalleryProps) => {
  const allImages = useMemo(
    () => [...(mainImage ? [mainImage] : []), ...(additionalImages || [])],
    [mainImage, additionalImages],
  );

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreenMounted, setIsFullscreenMounted] = useState(false);
  const [isFullscreenVisible, setIsFullscreenVisible] = useState(false);

  useEffect(() => {
    if (allImages.length > 0) {
      setCurrentImage(allImages[0].url);
      setSliderIndex(0);
    }
  }, [allImages]);

  useEffect(() => {
    if (!isFullscreenMounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreenMounted]);

  if (allImages.length === 0) {
    return (
      <div className={styles.placeholder}>
        <img src='https://placehold.co/400?text=No+Image' alt='No image' />
      </div>
    );
  }

  const transitionToImage = (url: string) => {
    if (url === currentImage) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentImage(url);
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }, 180);
  };

  const handleImageSelect = (url: string) => {
    transitionToImage(url);
  };

  const maxIndex = Math.max(0, allImages.length - 3);
  const currentIndex = allImages.findIndex((image) => image.url === currentImage);

  const handlePrev = () => {
    setSliderIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSliderIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleFullscreenNavigation = (direction: 'prev' | 'next') => {
    if (!allImages.length) return;

    const activeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex =
      direction === 'next'
        ? (activeIndex + 1) % allImages.length
        : (activeIndex - 1 + allImages.length) % allImages.length;

    transitionToImage(allImages[nextIndex].url);
  };

  const handleOpenFullscreen = () => {
    setIsFullscreenMounted(true);
    requestAnimationFrame(() => {
      setIsFullscreenVisible(true);
    });
  };

  const handleCloseFullscreen = () => {
    setIsFullscreenVisible(false);
    window.setTimeout(() => {
      setIsFullscreenMounted(false);
    }, 260);
  };

  const fullscreenModal =
    isFullscreenMounted && currentImage
      ? createPortal(
          <div
            className={`${styles.fullscreenOverlay} ${
              isFullscreenVisible ? styles.fullscreenOverlayVisible : ''
            }`}
            onClick={handleCloseFullscreen}
          >
            <div
              className={`${styles.fullscreenDialog} ${
                isFullscreenVisible ? styles.fullscreenDialogVisible : ''
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type='button'
                className={styles.closeButton}
                onClick={handleCloseFullscreen}
              >
                ×
              </button>

              {allImages.length > 1 && (
                <button
                  type='button'
                  className={`${styles.fullscreenNav} ${styles.fullscreenNavLeft}`}
                  onClick={() => handleFullscreenNavigation('prev')}
                >
                  <ArrowButton direction='left' variant='minimal' />
                </button>
              )}

              <img
                src={currentImage}
                alt={altText}
                className={`${styles.fullscreenImage} ${
                  isTransitioning ? styles.fading : ''
                }`}
              />

              {allImages.length > 1 && (
                <button
                  type='button'
                  className={`${styles.fullscreenNav} ${styles.fullscreenNavRight}`}
                  onClick={() => handleFullscreenNavigation('next')}
                >
                  <ArrowButton direction='right' variant='minimal' />
                </button>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className={styles.galleryContainer}>
        <div
          className={styles.mainImageWrapper}
          onClick={handleOpenFullscreen}
          role='button'
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleOpenFullscreen();
            }
          }}
        >
          <img
            src={currentImage || 'https://placehold.co/400?text=Loading'}
            alt={altText}
            className={`${styles.mainImage} ${
              isTransitioning ? styles.fading : ''
            }`}
          />
        </div>

        {allImages.length > 1 && (
          <div className={styles.sliderContainer}>
            {allImages.length > 3 && (
              <ArrowButton
                direction='left'
                onClick={handlePrev}
                variant='minimal'
                disabled={sliderIndex === 0}
              />
            )}

            <div className={styles.thumbnailsViewport}>
              <div
                className={styles.thumbnailsTrack}
                style={{
                  transform: `translateX(-${sliderIndex * (152 + 24)}px)`,
                  justifyContent: allImages.length > 3 ? 'flex-start' : 'center',
                }}
              >
                {allImages.map((img, index) => {
                  const isActive = currentImage === img.url;
                  return (
                    <button
                      type='button'
                      key={`${img.url}-${index}`}
                      className={`${styles.thumbnailItem} ${
                        isActive ? styles.active : ''
                      }`}
                      onClick={() => handleImageSelect(img.url)}
                    >
                      <img src={img.url} alt={`Thumbnail ${index + 1}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {allImages.length > 3 && (
              <ArrowButton
                direction='right'
                onClick={handleNext}
                variant='minimal'
                disabled={sliderIndex >= maxIndex}
              />
            )}
          </div>
        )}
      </div>

      {fullscreenModal}
    </>
  );
};

export { ProductGallery };
