import { WeddingPhoto } from '../types';
import weddingPhotosData from './wedding-photos.json';

// Convert JSON data to match WeddingPhoto interface
export const weddingPhotos: WeddingPhoto[] = weddingPhotosData.map(photo => ({
  id: photo.id.toString(),
  src: photo.src,
  thumbnail: photo.thumbnail,
  category: photo.category
}));
