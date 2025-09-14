import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_FILE = path.join(__dirname, '../src/data/wedding-photos.json');

async function removeAltProperty() {
  try {
    // Read the current JSON file
    const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    
    // Remove alt property from each photo object
    const updatedData = jsonData.map(photo => {
      const { alt, ...photoWithoutAlt } = photo;
      return photoWithoutAlt;
    });
    
    // Write the updated JSON back to file
    fs.writeFileSync(JSON_FILE, JSON.stringify(updatedData, null, 2));
    
    console.log(`Successfully removed alt property from ${updatedData.length} photos`);
    
  } catch (error) {
    console.error('Error removing alt property:', error);
  }
}

removeAltProperty();
