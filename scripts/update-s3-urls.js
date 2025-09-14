import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - Update these values
const S3_BUCKET_NAME = 'karen-maurizio-wedding-photos';
const S3_REGION = 'us-east-1'; // Change to your bucket's region
const S3_BASE_URL = `https://${S3_BUCKET_NAME}.s3.amazonaws.com`;

const WEDDING_PHOTOS_PATH = path.join(__dirname, '..', 'src', 'data', 'wedding-photos.json');

async function updateImageUrls() {
  try {
    console.log('Reading wedding photos JSON...');
    const photosData = fs.readFileSync(WEDDING_PHOTOS_PATH, 'utf8');
    const photos = JSON.parse(photosData);

    console.log(`Found ${photos.length} photos to update...`);

    // Update each photo's URLs to point to S3
    const updatedPhotos = photos.map((photo, index) => {
      const originalSrc = photo.src;
      const originalThumbnail = photo.thumbnail;

      // Convert local paths to S3 URLs
      // From: "/images/KM (5).jpg" 
      // To: "https://bucket.s3.amazonaws.com/images/KM (5).jpg"
      const newSrc = originalSrc.replace('/images/', `${S3_BASE_URL}/images/`);
      const newThumbnail = originalThumbnail.replace('/images/thumbnails/', `${S3_BASE_URL}/images/thumbnails/`);

      console.log(`${index + 1}/${photos.length}: Updated ${path.basename(originalSrc)}`);

      return {
        ...photo,
        src: newSrc,
        thumbnail: newThumbnail
      };
    });

    // Create backup of original file
    const backupPath = WEDDING_PHOTOS_PATH.replace('.json', '.backup.json');
    fs.writeFileSync(backupPath, photosData);
    console.log(`✅ Backup created: ${backupPath}`);

    // Write updated JSON
    fs.writeFileSync(WEDDING_PHOTOS_PATH, JSON.stringify(updatedPhotos, null, 2));
    console.log(`✅ Updated wedding-photos.json with S3 URLs`);

    console.log('\n🎉 Successfully updated all image URLs to S3!');
    console.log(`📦 S3 Base URL: ${S3_BASE_URL}`);
    console.log(`📁 Total photos updated: ${photos.length}`);

  } catch (error) {
    console.error('❌ Error updating image URLs:', error.message);
  }
}

// Run the update
updateImageUrls();
