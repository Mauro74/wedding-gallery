# Karen & Maurizio Wedding Gallery

A beautiful, responsive wedding photo gallery built with React, TypeScript, and Vite.

## Features

- **Full-screen tiled thumbnail layout** - Beautiful grid display of wedding photos
- **Modal lightbox viewer** - Click any thumbnail to view the full-size image
- **Keyboard navigation** - Use left/right arrow keys to navigate between images
- **Navigation arrows** - Click arrows on either side of images to navigate
- **Responsive design** - Optimized for desktop, tablet, and mobile devices
- **Elegant wedding theme** - Beautiful styling with warm colors and typography

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3002`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Styled Components** - CSS-in-JS styling
- **Unsplash** - Sample wedding photos (replace with actual photos)

## Customization

### Adding Your Own Photos

Replace the sample photos in `src/data/photos.ts` with your actual wedding photos:

```typescript
export const weddingPhotos: WeddingPhoto[] = [
  {
    id: '1',
    src: 'path/to/full-size-image.jpg',
    thumbnail: 'path/to/thumbnail.jpg',
    alt: 'Description of the photo'
  },
  // Add more photos...
];
```

### Styling

The app uses styled-components for styling. Main components:
- `src/components/Gallery.tsx` - Main gallery grid and layout
- `src/components/ImageModal.tsx` - Lightbox modal for full-size viewing
- `src/index.css` - Global styles

## Deployment

Build the app for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## License

This project is created for Karen & Maurizio's wedding celebration.
