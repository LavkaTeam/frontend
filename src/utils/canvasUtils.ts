export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  blur: number;
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  adjustments: ImageAdjustments,
  outputType: 'image/jpeg' | 'image/png' = 'image/jpeg',
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // Визначаємо точний розмір обмежувального контейнера повернутого фото
  const rotRad = (rotation * Math.PI) / 180;
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Транслюємо центр, обертаємо і повертаємо назад
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Застосовуємо фільтри
  ctx.filter = `
    brightness(${adjustments.brightness}%) 
    contrast(${adjustments.contrast}%) 
    saturate(${adjustments.saturation}%)
    grayscale(${adjustments.grayscale}%)
    sepia(${adjustments.sepia}%)
    hue-rotate(${adjustments.hueRotate}deg)
    blur(${adjustments.blur}px)
  `;
  ctx.drawImage(image, 0, 0);

  const finalCanvas = document.createElement('canvas');
  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) return null;

  // КРИТИЧНИЙ ФІКС ПРОДУКТИВНОСТІ: Обмежуємо максимальний розмір 2500x2500
  const MAX_SIZE = 2500;
  let outWidth = pixelCrop.width;
  let outHeight = pixelCrop.height;

  if (outWidth > MAX_SIZE || outHeight > MAX_SIZE) {
    const scale = Math.min(MAX_SIZE / outWidth, MAX_SIZE / outHeight);
    outWidth = Math.round(outWidth * scale);
    outHeight = Math.round(outHeight * scale);
  }

  finalCanvas.width = outWidth;
  finalCanvas.height = outHeight;

  // Заповнюємо білим фоном
  finalCtx.fillStyle = '#FFFFFF';
  finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Малюємо вирізану і (якщо потрібно) масштабовану частину
  finalCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outWidth,
    outHeight,
  );

  return new Promise((resolve, reject) => {
    finalCanvas.toBlob(
      (file) => {
        if (file) resolve(file);
        else reject(new Error('Canvas is empty'));
      },
      outputType,
      0.95,
    );
  });
}
