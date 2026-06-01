/**
 * Compresses an image file on the client-side using HTML5 Canvas
 * downscaling to reduce network payload and server storage overhead.
 * 
 * @param {File} file - The original image file input object.
 * @param {Object} options - Optional configuration flags.
 * @returns {Promise<File>} A resolved promise returning the optimized WebP image file.
 */
export const compressImagePipeline = (file, options = {}) => {
  const maxWidth = options.maxWidth || 1920;
  const maxHeight = options.maxHeight || 1080;
  const quality = options.quality || 0.75;

  return new Promise((resolve, reject) => {
    // If it's not an image format, bypass compression safely
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate responsive bounding boxes maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Initialize high-performance offscreen rendering canvas context
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export to progressive webp format chunk array
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas rasterization pipeline failed'));
            }
            // Construct replacement optimized file wrapper object
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};