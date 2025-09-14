import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { weddingPhotos } from '../data/photos';
import ImageModal from './ImageModal';
import LazyImage from './LazyImage';

const GalleryContainer = styled.div`
  margin: 4rem auto;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 6rem;
  color: #d4d4c8;
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
  color: #d4d4c8;
  opacity: 0.8;
  margin-bottom: 40px;
  font-style: italic;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2px;
  padding: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const Gallery: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openModal = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const navigateImage = useCallback(
    (direction: 'prev' | 'next') => {
      if (selectedImageIndex === null) return;

      if (direction === 'prev') {
        setSelectedImageIndex((prev) => (prev === null ? null : prev === 0 ? weddingPhotos.length - 1 : prev - 1));
      } else {
        setSelectedImageIndex((prev) => (prev === null ? null : prev === weddingPhotos.length - 1 ? 0 : prev + 1));
      }
    },
    [selectedImageIndex]
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
      <Title>Karen & Maurizio</Title>
      <Subtitle>Our Wedding Day • A Celebration Of Love</Subtitle>
      <PhotoGrid>
        {weddingPhotos.map((photo, index) => (
          <LazyImage key={photo.id} src={photo.src} thumbnail={photo.thumbnail} onClick={() => openModal(index)} />
        ))}
      </PhotoGrid>
      {selectedImageIndex !== null && (
        <ImageModal
          photo={weddingPhotos[selectedImageIndex]}
          isOpen={selectedImageIndex !== null}
          onClose={closeModal}
          onPrevious={() => navigateImage('prev')}
          onNext={() => navigateImage('next')}
          currentIndex={selectedImageIndex}
          totalImages={weddingPhotos.length}
        />
      )}
    </GalleryContainer>
  );
};

export default Gallery;
