import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const S3_BUCKET_NAME = 'karen-maurizio-wedding-photos';
const S3_REGION = 'us-east-1';
const S3_BASE_URL = `https://${S3_BUCKET_NAME}.s3.amazonaws.com`;

const NEW_IMAGES_DIR = path.join(__dirname, '..', 'new-images');
const TEMP_THUMBNAILS_DIR = path.join(__dirname, '..', 'temp-thumbnails');
const WEDDING_PHOTOS_PATH = path.join(__dirname, '..', 'src', 'data', 'wedding-photos.json');

const s3Client = new S3Client({ region: S3_REGION });
const CATEGORIES = ['ceremony', 'reception', 'portraits', 'candid'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

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
      .resize(400, 400, { fit: 'cover', position: 'center' })
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

async function selectCategory(fileName) {
  console.log(`\n📸 Image: ${fileName}`);
  console.log('Select category:');
  CATEGORIES.forEach((cat, index) => {
    console.log(`  ${index + 1}. ${cat}`);
  });
  
  const answer = await askQuestion('Enter category number (1-4): ');
  const categoryIndex = parseInt(answer) - 1;
  
  if (categoryIndex >= 0 && categoryIndex < CATEGORIES.length) {
    return CATEGORIES[categoryIndex];
  } else {
    console.log('Invalid selection, using "candid" as default');
    return 'candid';
  }
}

async function processNewImagesInteractive() {
  try {
    console.log('🚀 Starting interactive image processing...\n');

    if (!fs.existsSync(NEW_IMAGES_DIR)) {
      fs.mkdirSync(NEW_IMAGES_DIR, { recursive: true });
      console.log(`📁 Created directory: ${NEW_IMAGES_DIR}`);
      console.log('📸 Place your new images in this directory and run the script again.');
      rl.close();
      return;
    }

    if (!fs.existsSync(TEMP_THUMBNAILS_DIR)) {
      fs.mkdirSync(TEMP_THUMBNAILS_DIR, { recursive: true });
    }

    const newImageFiles = fs.readdirSync(NEW_IMAGES_DIR)
      .filter(file => file.toLowerCase().endsWith('.jpg'));

    if (newImageFiles.length === 0) {
      console.log('📸 No new images found in new-images directory.');
      rl.close();
      return;
    }

    console.log(`📸 Found ${newImageFiles.length} new images to process...\n`);

    const existingPhotosData = fs.readFileSync(WEDDING_PHOTOS_PATH, 'utf8');
    const existingPhotos = JSON.parse(existingPhotosData);
    let nextId = getNextId(existingPhotos);

    const newPhotoEntries = [];

    for (let i = 0; i < newImageFiles.length; i++) {
      const fileName = newImageFiles[i];
      const inputPath = path.join(NEW_IMAGES_DIR, fileName);
      const thumbnailPath = path.join(TEMP_THUMBNAILS_DIR, fileName);

      console.log(`\n📷 Processing ${fileName} (${i + 1}/${newImageFiles.length})`);

      // Get category from user
      const category = await selectCategory(fileName);

      // Resize main image
      console.log('  📏 Resizing image...');
      const resizedPath = path.join(TEMP_THUMBNAILS_DIR, `resized_${fileName}`);
      await sharp(inputPath)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(resizedPath);

      // Generate thumbnail
      console.log('  🖼️  Generating thumbnail...');
      await generateThumbnail(inputPath, thumbnailPath);

      // Upload to S3
      console.log('  ☁️  Uploading to S3...');
      const mainImageKey = `images/${fileName}`;
      const thumbnailKey = `images/thumbnails/${fileName}`;
      
      await uploadToS3(resizedPath, mainImageKey);
      await uploadToS3(thumbnailPath, thumbnailKey);

      // Create JSON entry
      const newEntry = {
        id: nextId++,
        src: `${S3_BASE_URL}/${mainImageKey}`,
        thumbnail: `${S3_BASE_URL}/${thumbnailKey}`,
        category: category
      };

      newPhotoEntries.push(newEntry);
      console.log(`  ✅ Added to ${category} category`);

      // Clean up temp files
      fs.unlinkSync(resizedPath);
      fs.unlinkSync(thumbnailPath);
    }

    // Update JSON file
    console.log('\n📝 Updating wedding-photos.json...');
    const updatedPhotos = [...existingPhotos, ...newPhotoEntries];
    
    const backupPath = WEDDING_PHOTOS_PATH.replace('.json', `.backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, existingPhotosData);
    fs.writeFileSync(WEDDING_PHOTOS_PATH, JSON.stringify(updatedPhotos, null, 2));

    // Move processed images
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
    console.log(`💾 Backup created: ${path.basename(backupPath)}`);
    console.log(`\n🚀 Next steps:`);
    console.log(`git add src/data/wedding-photos.json`);
    console.log(`git commit -m "Add ${newImageFiles.length} new wedding photos"`);
    console.log(`git push origin main`);

  } catch (error) {
    console.error('❌ Error processing images:', error.message);
  } finally {
    if (fs.existsSync(TEMP_THUMBNAILS_DIR)) {
      fs.rmSync(TEMP_THUMBNAILS_DIR, { recursive: true, force: true });
    }
    rl.close();
  }
}

processNewImagesInteractive();
