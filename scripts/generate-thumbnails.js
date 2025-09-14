import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const THUMBNAILS_DIR = path.join(__dirname, '../src/assets/thumbnails');

// Create thumbnails directory if it doesn't exist
if (!fs.existsSync(THUMBNAILS_DIR)) {
  fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

async function generateThumbnails() {
  try {
    const files = fs.readdirSync(ASSETS_DIR);
    const imageFiles = files.filter(
      (file) =>
        file.toLowerCase().endsWith('.jpg') ||
        file.toLowerCase().endsWith('.jpeg') ||
        file.toLowerCase().endsWith('.png')
    );

    console.log(`Found ${imageFiles.length} images to process...`);

    for (const file of imageFiles) {
      const inputPath = path.join(ASSETS_DIR, file);
      const outputPath = path.join(THUMBNAILS_DIR, file);

      // Skip if thumbnail already exists
      if (fs.existsSync(outputPath)) {
        console.log(`Thumbnail already exists for ${file}, skipping...`);
        continue;
      }

      try {
        await sharp(inputPath)
          .resize(400, 400, {
            fit: 'cover',
            position: 'center',
          })
          .jpeg({ quality: 80 })
          .toFile(outputPath);

        console.log(`Generated thumbnail for ${file}`);
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    }

    console.log('Thumbnail generation complete!');
  } catch (error) {
    console.error('Error generating thumbnails:', error);
  }
}

generateThumbnails();
