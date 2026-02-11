import { useState, useEffect, useMemo } from 'react';
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

  useEffect(() => {
    if (allImages.length > 0) {
      setCurrentImage(allImages[0].url);
      setSliderIndex(0);
    }
  }, [allImages]);

  if (allImages.length === 0) {
    return (
      <div className={styles.placeholder}>
        <img src='https://placehold.co/400?text=No+Image' alt='No image' />
      </div>
    );
  }

  const handleImageSelect = (url: string) => {
    if (url === currentImage) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentImage(url);
      setIsTransitioning(false);
    }, 200);
  };

  const maxIndex = Math.max(0, allImages.length - 3);
  const handlePrev = () => {
    setSliderIndex((prev) => Math.max(0, prev - 1));
  };
  const handleNext = () => {
    setSliderIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageWrapper}>
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
                  <div
                    key={`${img.url}-${index}`}
                    className={`${styles.thumbnailItem} ${
                      isActive ? styles.active : ''
                    }`}
                    onClick={() => handleImageSelect(img.url)}
                  >
                    <img src={img.url} alt={`Thumbnail ${index}`} />
                  </div>
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
  );
};
export { ProductGallery };
