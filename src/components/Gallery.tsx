import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { weddingPhotos } from '../data/photos';
import ImageModal from './ImageModal';
import LazyImage from './LazyImage';
import CategoryFilter from './CategoryFilter';
// import CoverImageSrc from '../assets/KM (497).jpg';

const GalleryContainer = styled.div`
  margin: 2rem auto;
`;

// const CoverImage = styled.div`
//   width: 100%;
//   height: 100vh;
//   margin-bottom: 2rem;
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   z-index: -1;
//   background-image: url('${CoverImageSrc}');
//   background-size: cover;
//   background-position: center;
//   filter: blur(4px) hue-rotate(126deg) grayscale(0.6);
// `;

const Title = styled.h1`
  text-align: center;
  font-size: 6rem;
  color: #eaeaea;
  margin-bottom: 10px;
  font-family: 'Luxurious Script', cursive;
  font-weight: 400;
  font-style: normal;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #b3a279;
  margin-bottom: 40px;
  font-style: italic;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2px;
  padding: 1px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const Gallery: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get unique categories and photo counts
  const { categories, photoCounts } = useMemo(() => {
    const categorySet = new Set<string>();
    const counts: Record<string, number> = {};

    weddingPhotos.forEach((photo) => {
      categorySet.add(photo.category);
      counts[photo.category] = (counts[photo.category] || 0) + 1;
    });

    return {
      categories: Array.from(categorySet),
      photoCounts: counts,
    };
  }, []);

  // Filter photos based on selected categories
  const filteredPhotos = useMemo(() => {
    if (selectedCategories.length === 0) {
      return weddingPhotos;
    }
    return weddingPhotos.filter((photo) => selectedCategories.includes(photo.category));
  }, [selectedCategories]);

  // Preload all thumbnails on component mount
  useEffect(() => {
    const preloadImages = () => {
      weddingPhotos.forEach((photo) => {
        const img = new Image();
        img.src = photo.thumbnail;
      });
    };

    preloadImages();
  }, []);

  const openModal = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      setSelectedCategories([]);
    } else {
      // Exclusive filtering - only one category can be selected at a time
      setSelectedCategories([category]);
    }
    setSelectedImageIndex(null);

    // Smooth scroll to top when filter changes
    window.scrollTo({
      top: 220,
      behavior: 'smooth',
    });
  };

  const navigateImage = useCallback(
    (direction: 'prev' | 'next') => {
      if (selectedImageIndex === null) return;

      if (direction === 'prev') {
        setSelectedImageIndex((prev) => (prev === null ? null : prev === 0 ? filteredPhotos.length - 1 : prev - 1));
      } else {
        setSelectedImageIndex((prev) => (prev === null ? null : prev === filteredPhotos.length - 1 ? 0 : prev + 1));
      }
    },
    [selectedImageIndex, filteredPhotos.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigateImage('prev');
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateImage('next');
          break;
        case 'Escape':
          event.preventDefault();
          closeModal();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImageIndex, navigateImage, closeModal]);

  return (
    <GalleryContainer>
      {/* <CoverImage title="Wedding cover" /> */}
      <Title>Karen & Maurizio</Title>
      <Subtitle>Our Wedding Day ~ A Celebration Of Love</Subtitle>
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        photoCounts={photoCounts}
        totalPhotos={weddingPhotos.length}
      />
      <PhotoGrid>
        {filteredPhotos.map((photo, index) => (
          <LazyImage key={photo.id} src={photo.src} thumbnail={photo.thumbnail} onClick={() => openModal(index)} />
        ))}
      </PhotoGrid>
      {selectedImageIndex !== null && (
        <ImageModal
          photo={filteredPhotos[selectedImageIndex]}
          isopen={selectedImageIndex !== null}
          onClose={closeModal}
          onPrevious={() => navigateImage('prev')}
          onNext={() => navigateImage('next')}
          currentIndex={selectedImageIndex}
          totalImages={filteredPhotos.length}
        />
      )}
    </GalleryContainer>
  );
};

export default Gallery;
