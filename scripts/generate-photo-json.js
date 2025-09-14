import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const OUTPUT_FILE = path.join(__dirname, '../src/data/wedding-photos.json');

// Categories for variety
const categories = ['ceremony', 'portraits', 'candid', 'reception'];

// Alt text variations for wedding photos
const altTexts = [
  'Karen & Maurizio - Beautiful Wedding Moment',
  'Wedding Celebration',
  'Romantic Wedding Portrait',
  'Wedding Day Joy',
  'Special Wedding Moment',
  'Wedding Party Celebration',
  'Bride & Groom Portrait',
  'Wedding Day Memories',
  'Romantic Wedding Scene',
  'Wedding Celebration Moment',
  'Beautiful Wedding Day',
  'Wedding Love Story',
  'Wedding Day Bliss',
  'Joyful Wedding Celebration',
  'Wedding Party Fun',
  'Wedding Ceremony Magic',
  'Beautiful Wedding Moment',
  'Wedding Day Happiness',
  'Elegant Wedding Portrait',
  'Wedding Love & Joy',
  'Special Wedding Day',
  'Wedding Day Magic',
  'Beautiful Wedding Memory',
  'Wedding Party Joy',
  'Elegant Wedding Moment',
  'Wedding Kiss',
  'Bridal Portrait',
  'Groom Portrait',
  'Wedding Rings',
  'Wedding Bouquet',
  'Wedding Dance',
  'Wedding Toast',
  'Wedding Cake',
  'Wedding Venue',
  'Wedding Guests',
  'Wedding Preparation',
  'Getting Ready',
  'First Look',
  'Walking Down Aisle',
  'Exchange of Vows',
  'Wedding Reception',
  'Wedding Dinner',
  'Wedding Music',
  'Wedding Laughter',
  'Wedding Tears of Joy',
  'Wedding Family',
  'Wedding Friends',
  'Wedding Details',
  'Wedding Flowers',
  'Wedding Decor'
];

async function generatePhotoJson() {
  try {
    const files = fs.readdirSync(ASSETS_DIR);
    const imageFiles = files.filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png')
    ).filter(file => !file.includes('thumbnails'));

    console.log(`Found ${imageFiles.length} images to process...`);

    // Sort files numerically by extracting the number from filename
    imageFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    const photos = imageFiles.map((file, index) => {
      const id = index + 1;
      const category = categories[index % categories.length];
      const altText = altTexts[index % altTexts.length];
      
      return {
        id,
        src: `/src/assets/${file}`,
        thumbnail: `/src/assets/thumbnails/${file}`,
        alt: altText,
        category
      };
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photos, null, 2));
    console.log(`Generated JSON file with ${photos.length} photos at ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('Error generating photo JSON:', error);
  }
}

generatePhotoJson();
