import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const S3_BUCKET_NAME = 'karen-maurizio-wedding-photos';
const S3_REGION = 'us-east-1';
const S3_BASE_URL = `https://${S3_BUCKET_NAME}.s3.amazonaws.com`;

// Local directories for new images
const NEW_IMAGES_DIR = path.join(__dirname, '..', 'new-images');
const TEMP_THUMBNAILS_DIR = path.join(__dirname, '..', 'temp-thumbnails');
const WEDDING_PHOTOS_PATH = path.join(__dirname, '..', 'src', 'data', 'wedding-photos.json');

// Initialize S3 client
const s3Client = new S3Client({ region: S3_REGION });

// Categories for new images
const CATEGORIES = ['ceremony', 'reception', 'portraits', 'candid'];

async function uploadToS3(filePath, s3Key) {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: 'image/jpeg',
      ACL: 'public-read'
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error(`❌ Error uploading ${s3Key}:`, error.message);
    return false;
  }
}

async function generateThumbnail(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`❌ Error generating thumbnail:`, error.message);
    return false;
  }
}

function getNextId(existingPhotos) {
  const maxId = Math.max(...existingPhotos.map(photo => photo.id));
  return maxId + 1;
}

function promptForCategory() {
  console.log('\nAvailable categories:');
  CATEGORIES.forEach((cat, index) => {
    console.log(`${index + 1}. ${cat}`);
  });
  
  // For automation, we'll cycle through categories
  // In a real scenario, you might want to use readline for user input
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

async function processNewImages() {
  try {
    console.log('🚀 Starting new image processing...\n');

    // Check if new-images directory exists
    if (!fs.existsSync(NEW_IMAGES_DIR)) {
      fs.mkdirSync(NEW_IMAGES_DIR, { recursive: true });
      console.log(`📁 Created directory: ${NEW_IMAGES_DIR}`);
      console.log('📸 Place your new images in this directory and run the script again.');
      return;
    }

    // Create temp thumbnails directory
    if (!fs.existsSync(TEMP_THUMBNAILS_DIR)) {
      fs.mkdirSync(TEMP_THUMBNAILS_DIR, { recursive: true });
    }

    // Get new image files
    const newImageFiles = fs.readdirSync(NEW_IMAGES_DIR)
      .filter(file => file.toLowerCase().endsWith('.jpg'));

    if (newImageFiles.length === 0) {
      console.log('📸 No new images found in new-images directory.');
      return;
    }

    console.log(`📸 Found ${newImageFiles.length} new images to process...\n`);

    // Load existing photos JSON
    const existingPhotosData = fs.readFileSync(WEDDING_PHOTOS_PATH, 'utf8');
    const existingPhotos = JSON.parse(existingPhotosData);
    let nextId = getNextId(existingPhotos);

    const newPhotoEntries = [];

    for (let i = 0; i < newImageFiles.length; i++) {
      const fileName = newImageFiles[i];
      const inputPath = path.join(NEW_IMAGES_DIR, fileName);
      const thumbnailPath = path.join(TEMP_THUMBNAILS_DIR, fileName);

      console.log(`Processing ${fileName} (${i + 1}/${newImageFiles.length})`);

      // 1. Resize main image
      console.log('  📏 Resizing image...');
      const resizedPath = path.join(TEMP_THUMBNAILS_DIR, `resized_${fileName}`);
      await sharp(inputPath)
        .resize(2000, 2000, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toFile(resizedPath);

      // 2. Generate thumbnail
      console.log('  🖼️  Generating thumbnail...');
      await generateThumbnail(inputPath, thumbnailPath);

      // 3. Upload main image to S3
      console.log('  ☁️  Uploading main image to S3...');
      const mainImageKey = `images/${fileName}`;
      await uploadToS3(resizedPath, mainImageKey);

      // 4. Upload thumbnail to S3
      console.log('  ☁️  Uploading thumbnail to S3...');
      const thumbnailKey = `images/thumbnails/${fileName}`;
      await uploadToS3(thumbnailPath, thumbnailKey);

      // 5. Create JSON entry
      const category = promptForCategory();
      const newEntry = {
        id: nextId++,
        src: `${S3_BASE_URL}/${mainImageKey}`,
        thumbnail: `${S3_BASE_URL}/${thumbnailKey}`,
        category: category
      };

      newPhotoEntries.push(newEntry);
      console.log(`  ✅ Added to ${category} category\n`);

      // Clean up temp files
      fs.unlinkSync(resizedPath);
      fs.unlinkSync(thumbnailPath);
    }

    // 6. Update JSON file
    console.log('📝 Updating wedding-photos.json...');
    const updatedPhotos = [...existingPhotos, ...newPhotoEntries];
    
    // Create backup
    const backupPath = WEDDING_PHOTOS_PATH.replace('.json', `.backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, existingPhotosData);
    console.log(`💾 Backup created: ${path.basename(backupPath)}`);

    // Write updated JSON
    fs.writeFileSync(WEDDING_PHOTOS_PATH, JSON.stringify(updatedPhotos, null, 2));

    // 7. Move processed images to processed folder
    const processedDir = path.join(NEW_IMAGES_DIR, 'processed');
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir);
    }

    newImageFiles.forEach(fileName => {
      const oldPath = path.join(NEW_IMAGES_DIR, fileName);
      const newPath = path.join(processedDir, fileName);
      fs.renameSync(oldPath, newPath);
    });

    console.log(`\n🎉 Successfully processed ${newImageFiles.length} new images!`);
    console.log(`📊 Total photos in gallery: ${updatedPhotos.length}`);
    console.log(`📁 Processed images moved to: new-images/processed/`);
    console.log(`\n🚀 Deploy your changes:`);
    console.log(`git add src/data/wedding-photos.json`);
    console.log(`git commit -m "Add ${newImageFiles.length} new wedding photos"`);
    console.log(`git push origin main`);

  } catch (error) {
    console.error('❌ Error processing new images:', error.message);
  } finally {
    // Clean up temp directory
    if (fs.existsSync(TEMP_THUMBNAILS_DIR)) {
      fs.rmSync(TEMP_THUMBNAILS_DIR, { recursive: true, force: true });
    }
  }
}

// Run the script
processNewImages();
