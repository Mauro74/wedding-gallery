import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images');

async function resizeImages() {
  try {
    // Check if directories exist
    if (!fs.existsSync(ASSETS_DIR)) {
      console.error('Assets directory not found:', ASSETS_DIR);
      return;
    }

    const files = fs.readdirSync(ASSETS_DIR);
    const imageFiles = files.filter(
      (file) =>
        file.toLowerCase().endsWith('.jpg') ||
        file.toLowerCase().endsWith('.jpeg') ||
        file.toLowerCase().endsWith('.png')
    );

    console.log(`Found ${imageFiles.length} images to resize...`);

    // Ensure public/images directory exists
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const inputPath = path.join(ASSETS_DIR, file);
      const outputPath = path.join(PUBLIC_DIR, file);

      try {
        console.log(`Processing ${file} (${i + 1}/${imageFiles.length})`);

        await sharp(inputPath)
          .resize(2000, 2000, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85 })
          .toFile(outputPath);

        console.log(`  ✅ Resized and saved`);
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }

    console.log(`\n🎉 Completed resizing ${imageFiles.length} images!`);
    console.log(`Images resized to max 2000px and saved to public/images/`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

resizeImages();
