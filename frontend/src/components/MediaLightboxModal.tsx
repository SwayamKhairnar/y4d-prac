import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaLightboxModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev / Next controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              onNavigate((currentIndex - 1 + images.length) % images.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => onNavigate((currentIndex + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
        <img
          src={currentImage}
          alt={`Supporting document full view ${currentIndex + 1}`}
          className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
        />

        {images.length > 1 && (
          <div className="flex items-center gap-2 mt-4 text-xs text-white/80 font-medium">
            <span>
              Image {currentIndex + 1} of {images.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
