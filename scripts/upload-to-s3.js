import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - Update these values
const S3_BUCKET_NAME = 'karen-maurizio-wedding-photos';
const S3_REGION = 'us-east-1'; // Change to your bucket's region

const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const PUBLIC_THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'images', 'thumbnails');

// Initialize S3 client
const s3Client = new S3Client({ 
  region: S3_REGION,
  // AWS credentials should be configured via AWS CLI or environment variables
});

async function uploadFile(filePath, s3Key) {
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

async function uploadAllImages() {
  try {
    console.log('🚀 Starting S3 upload process...\n');

    // Get all image files
    const imageFiles = fs.readdirSync(PUBLIC_IMAGES_DIR)
      .filter(file => file.toLowerCase().endsWith('.jpg'));

    const thumbnailFiles = fs.readdirSync(PUBLIC_THUMBNAILS_DIR)
      .filter(file => file.toLowerCase().endsWith('.jpg'));

    console.log(`📸 Found ${imageFiles.length} main images`);
    console.log(`🖼️  Found ${thumbnailFiles.length} thumbnails\n`);

    let successCount = 0;
    let totalFiles = imageFiles.length + thumbnailFiles.length;

    // Upload main images
    console.log('📤 Uploading main images...');
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const filePath = path.join(PUBLIC_IMAGES_DIR, file);
      const s3Key = `images/${file}`;
      
      console.log(`  ${i + 1}/${imageFiles.length}: ${file}`);
      
      if (await uploadFile(filePath, s3Key)) {
        successCount++;
      }
    }

    // Upload thumbnails
    console.log('\n📤 Uploading thumbnails...');
    for (let i = 0; i < thumbnailFiles.length; i++) {
      const file = thumbnailFiles[i];
      const filePath = path.join(PUBLIC_THUMBNAILS_DIR, file);
      const s3Key = `images/thumbnails/${file}`;
      
      console.log(`  ${i + 1}/${thumbnailFiles.length}: ${file}`);
      
      if (await uploadFile(filePath, s3Key)) {
        successCount++;
      }
    }

    console.log(`\n🎉 Upload complete!`);
    console.log(`✅ Successfully uploaded: ${successCount}/${totalFiles} files`);
    console.log(`📦 S3 Bucket: ${S3_BUCKET_NAME}`);
    console.log(`🌍 Region: ${S3_REGION}`);
    
    if (successCount === totalFiles) {
      console.log('\n✨ All files uploaded successfully! You can now:');
      console.log('1. Run the URL update script: node scripts/update-s3-urls.js');
      console.log('2. Remove local images from public/images/ to reduce repo size');
    }

  } catch (error) {
    console.error('❌ Error during upload process:', error.message);
  }
}

// Run the upload
uploadAllImages();
