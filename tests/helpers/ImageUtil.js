const Jimp = require('jimp');
const fs = require('fs');

class ImageUtil {
    /**
     * Resizes an image to ensure it is under a specific file size limit (default 300KB).
     * It first resizes to a max width of 800px, then iteratively scales down by 20%
     * until the file size is under the limit or the image becomes too small.
     * 
     * @param {string} filePath - Path to the image file
     * @param {number} maxSizeKB - Maximum file size in KB (default: 300)
     * @param {number} minWidth - Minimum width to stop scaling (default: 300)
     */
    static async resizeImageToLimit(filePath, maxSizeKB = 300, minWidth = 300) {
        try {
            let image = await Jimp.read(filePath);
            
            // Initial resize to standard width
            await image.resize(800, Jimp.AUTO).quality(60).writeAsync(filePath);

            let fileStats = fs.statSync(filePath);
            
            // Iterative reduction
            while (fileStats.size > maxSizeKB * 1024) {
                image = await Jimp.read(filePath);
                if (image.bitmap.width < minWidth) {
                    console.warn(`ImageUtil: Image reached minimum width (${minWidth}px) but is still ${fileStats.size / 1024}KB`);
                    break;
                }
                
                // Scale down by 20%
                await image.scale(0.8).quality(60).writeAsync(filePath);
                fileStats = fs.statSync(filePath);
            }
        } catch (error) {
            console.error('ImageUtil: Failed to resize image:', error);
            throw error;
        }
    }
}

module.exports = ImageUtil;

