// Helper functions for cropping images using HTML5 Canvas and react-easy-crop coordinates

export type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// Creates an Image DOM element from a source URL
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => {
      // If crossOrigin fails due to restrictive headers, fallback without attribute
      const fallbackImage = new window.Image();
      fallbackImage.addEventListener("load", () => resolve(fallbackImage));
      fallbackImage.addEventListener("error", (err) => reject(err));
      fallbackImage.src = url;
    });
    image.src = url;
  });

// Converts degrees to radians
function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

// Generates a cropped image File and preview URL from source image and pixel coordinates
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation: number = 0,
  fileName: string = "author-portrait.jpg",
): Promise<{ file: File | null; url: string }> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context is not available");
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = {
    width:
      Math.abs(Math.cos(rotRad) * image.width) +
      Math.abs(Math.sin(rotRad) * image.height),
    height:
      Math.abs(Math.sin(rotRad) * image.width) +
      Math.abs(Math.cos(rotRad) * image.height),
  };

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to a central location to allow rotating and flipping
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  // Extract cropped canvas with the exact dimensions
  const cropCanvas = document.createElement("canvas");
  const cropCtx = cropCanvas.getContext("2d");

  if (!cropCtx) {
    throw new Error("Crop canvas 2D context is not available");
  }

  const cropWidth = Math.max(1, Math.round(pixelCrop.width));
  const cropHeight = Math.max(1, Math.round(pixelCrop.height));

  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;

  cropCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    cropWidth,
    cropHeight,
  );

  return new Promise((resolve) => {
    try {
      cropCanvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({ file: null, url: imageSrc });
            return;
          }
          const file = new File([blob], fileName, { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          resolve({ file, url });
        },
        "image/jpeg",
        0.95,
      );
    } catch {
      // Fallback if canvas security restricts export
      resolve({ file: null, url: imageSrc });
    }
  });
}
