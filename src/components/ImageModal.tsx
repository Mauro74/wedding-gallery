import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { WeddingPhoto } from '../types/index';

interface ImageModalProps {
  photo: WeddingPhoto;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 10px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    max-width: 100vw;
    max-height: 100vh;
    padding: 60px 20px 80px;
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    border-radius: 4px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    top: 0px;
    right: 10px;
  }
`;

const NavigationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${(props) => props.direction}: 0px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 24px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1001;

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 768px) {
    ${(props) => props.direction}: 0px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  @media (max-width: 480px) {
    ${(props) => props.direction}: 0px;
    top: auto;
    bottom: 20px;
    transform: none;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const ImageInfo = styled.div`
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
`;

const ImageCounter = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ImageModal: React.FC<ImageModalProps> = ({
  photo,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  currentIndex,
  totalImages,
}) => {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [isSwipeEnabled, setIsSwipeEnabled] = useState<boolean>(true);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isSwipeEnabled) return;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwipeEnabled) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isSwipeEnabled) return;

    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      // Temporarily disable swipe to prevent rapid firing
      setIsSwipeEnabled(false);
      setTimeout(() => setIsSwipeEnabled(true), 300);

      if (swipeDistance > 0) {
        // Swiped left - go to next image
        onNext();
      } else {
        // Swiped right - go to previous image
        onPrevious();
      }
    }
  };

  // Close modal when clicking on overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <CloseButton onClick={onClose} aria-label="Close modal">
          ×
        </CloseButton>

        <NavigationButton direction="left" onClick={onPrevious} aria-label="Previous image">
          ‹
        </NavigationButton>

        <ModalImage src={photo.src} alt="Wedding photo" loading="eager" />

        <NavigationButton direction="right" onClick={onNext} aria-label="Next image">
          ›
        </NavigationButton>

        <ImageInfo>
          <ImageCounter>
            {currentIndex + 1} of {totalImages}
          </ImageCounter>
        </ImageInfo>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageModal;
