import React, { useState } from 'react';
import styled from 'styled-components';

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

const Image = styled.img<{ isloaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: ${(props) => (props.isloaded ? 1 : 0.9)};
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

const ErrorPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4a4a4a, #2a2a2a);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #d4d4c8;
  font-size: 0.9rem;
  text-align: center;
  padding: 20px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #5a5a5a, #3a3a3a);
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 8px;
    opacity: 0.7;
  }

  .text {
    opacity: 0.8;
    font-size: 0.8rem;
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

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <ImageContainer onClick={onClick}>
      {!isLoaded && !hasError && <LoadingPlaceholder />}
      {hasError && (
        <ErrorPlaceholder>
          <div className="icon">📷</div>
          <div className="text">Failed to load</div>
        </ErrorPlaceholder>
      )}
      <Image src={thumbnail} alt="Wedding photo" isloaded={isLoaded} onLoad={handleLoad} onError={handleError} />
      <ImageOverlay></ImageOverlay>
    </ImageContainer>
  );
};

export default LazyImage;
