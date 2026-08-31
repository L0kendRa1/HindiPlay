import React, { useState } from 'react';

interface PictureImageProps {
  src?: string;
  alt: string;
  fallbackEmoji?: string;
  className?: string;
  sizeClassName?: string;
}

export const PictureImage: React.FC<PictureImageProps> = ({
  src,
  alt,
  fallbackEmoji = '🖼️',
  className = '',
  sizeClassName = 'w-24 h-24 md:w-32 md:h-32',
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // If no source provided or failed to load, display child-friendly fallback
  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center select-none ${sizeClassName} ${className}`}
        aria-label={alt}
      >
        <span className="text-5xl md:text-6xl filter drop-shadow-sm transform hover:scale-110 transition-transform">
          {fallbackEmoji}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center select-none ${sizeClassName} ${className}`}
    >
      {/* Skeleton loader / instant placeholder while SVG loads */}
      {!isLoaded && (
        <span className="text-4xl md:text-5xl opacity-40 animate-pulse absolute">
          {fallbackEmoji}
        </span>
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-contain filter drop-shadow-xs transition-all duration-200 transform hover:scale-105 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
    </div>
  );
};
