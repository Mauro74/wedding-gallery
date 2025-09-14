import React, { useState } from 'react';
import styled from 'styled-components';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyImageProps {
  src: string;
  thumbnail: string;
  onClick: () => void;
}

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  aspect-ratio: 1;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Image = styled.img<{ isLoaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: ${(props) => (props.isLoaded ? 1 : 0)};
`;

const LoadingPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #2f4f4f 25%, #3a5f5f 50%, #2f4f4f 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, transparent 70%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 15px;

  ${ImageContainer}:hover & {
    opacity: 1;
  }
`;

const LazyImage: React.FC<LazyImageProps> = ({ thumbnail, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <ImageContainer ref={elementRef} onClick={onClick}>
      {!isLoaded && !hasError && <LoadingPlaceholder />}
      {hasIntersected && (
        <Image
          src={thumbnail}
          alt="Wedding photo"
          loading="lazy"
          isLoaded={isLoaded}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      <ImageOverlay></ImageOverlay>
    </ImageContainer>
  );
};

export default LazyImage;
