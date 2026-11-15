import { useState, useEffect, useCallback } from 'react';
import { PhotoBook } from '../types/photobook.ts';
import SpaceArchiveMatteImage from './SpaceArchiveMatteImage.tsx';

interface PhotoBookDetailProps {
  book: PhotoBook;
  onBack: () => void;
}

/**
 * Detail view for an individual photo book monograph.
 * Displays all plates with Space Archive 1:1 white matting.
 * Clicking a plate opens a keyboard-accessible lightbox with previous/next navigation.
 */
export default function PhotoBookDetail({ book, onBack }: PhotoBookDetailProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const selectedPhoto =
    selectedPhotoIndex !== null && book.photos[selectedPhotoIndex]
      ? book.photos[selectedPhotoIndex]
      : null;

  const handleCloseLightbox = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  const handlePrevPhoto = useCallback(() => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null || book.photos.length <= 1) return prev;
      return (prev - 1 + book.photos.length) % book.photos.length;
    });
  }, [book.photos.length]);

  const handleNextPhoto = useCallback(() => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null || book.photos.length <= 1) return prev;
      return (prev + 1) % book.photos.length;
    });
  }, [book.photos.length]);

  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhotoIndex, handleCloseLightbox, handlePrevPhoto, handleNextPhoto]);

  return (
    <div className="w-full bg-[#0A0A0A] text-white min-h-screen py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between pb-6 mb-10 sm:mb-12 border-b border-white/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-light tracking-tight uppercase text-neutral-400 hover:text-white transition-colors bg-transparent border-0 p-0 cursor-pointer"
          >
            <span aria-hidden="true">←</span>
            <span>Return to Monographs</span>
          </button>
        </div>

        {/* Monograph Title, Subtitle & Curator Note */}
        <header className="mb-12 sm:mb-16 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
            {book.title}
          </h1>
          {book.subtitle && book.subtitle.trim() !== (book.curatorNote || '').trim() && (
            <p className="text-base sm:text-lg font-normal text-neutral-300 tracking-wide">
              {book.subtitle}
            </p>
          )}
          {book.curatorNote && (
            <p className="text-sm sm:text-base font-light text-neutral-400 leading-relaxed max-w-2xl whitespace-pre-line">
              {book.curatorNote}
            </p>
          )}
        </header>

        {/* Plates in Monograph: Single column gallery with 1:1 matting */}
        <div className="space-y-20 sm:space-y-28">
          {book.photos.map((photo, pIdx) => (
            <div key={photo.id} className="space-y-6">
              <div
                className="cursor-zoom-in"
                onClick={() => setSelectedPhotoIndex(pIdx)}
              >
                <SpaceArchiveMatteImage
                  src={photo.imageUrl}
                  alt={photo.title}
                  title={photo.title}
                  archivalCode={`PLATE ${String(pIdx + 1).padStart(2, '0')}`}
                  aspectRatioLabel={photo.aspectRatioLabel}
                  showArchivalStamp={false}
                  mattePaddingClass="p-0"
                  className="shadow-2xl shadow-black/80"
                />
              </div>

              {/* Plate Technical Provenance: Title, Series, Location and Camera/Apparatus */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 pt-4 border-t border-white/10 text-xs font-light tracking-tight text-neutral-400">
                <div>
                  <span className="text-neutral-500 block uppercase text-[10px] tracking-tight">TITLE</span>
                  <span className="text-white font-normal">{photo.title}</span>
                </div>
                {photo.subtitle ? (
                  <div>
                    <span className="text-neutral-500 block uppercase text-[10px] tracking-tight">SERIES</span>
                    <span className="text-neutral-300">{photo.subtitle}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-neutral-500 block uppercase text-[10px] tracking-tight">INDEX</span>
                    <span className="text-neutral-300">PLATE #{String(pIdx + 1).padStart(2, '0')}</span>
                  </div>
                )}
                <div>
                  <span className="text-neutral-500 block uppercase text-[10px] tracking-tight">LOCATION</span>
                  <span className="text-neutral-300">{photo.location || 'SEOUL, KOREA'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block uppercase text-[10px] tracking-tight">CAMERA / FILM</span>
                  <span className="text-neutral-300">
                    {photo.filmStockOrCamera || '35mm Monochrom'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Back Action */}
        <div className="mt-20 sm:mt-28 pt-10 border-t border-white/10 flex justify-start items-center text-xs font-light tracking-tight text-neutral-400">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:text-white uppercase tracking-tight bg-transparent border-0 p-0 cursor-pointer transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Return to Monographs</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && selectedPhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={handleCloseLightbox}
        >
          <button
            type="button"
            onClick={handleCloseLightbox}
            aria-label="Close lightbox"
            className="absolute top-5 right-6 sm:top-6 sm:right-8 w-10 h-10 flex items-center justify-center text-2xl font-light leading-none text-neutral-400 hover:text-white bg-transparent border-0 cursor-pointer transition-colors"
          >
            ×
          </button>

          <div
            className="w-full max-w-[min(90vw,70vh,672px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <SpaceArchiveMatteImage
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              title={selectedPhoto.title}
              showArchivalStamp={false}
              priority={true}
              mattePaddingClass="p-0"
              className="shadow-2xl shadow-black"
            />
            <div className="mt-4 flex items-center justify-between gap-4 text-xs font-light tracking-tight text-neutral-400">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-white truncate">{selectedPhoto.title}</span>
                {selectedPhoto.filmStockOrCamera && (
                  <span className="hidden sm:inline text-neutral-500 truncate">
                    · {selectedPhoto.filmStockOrCamera}
                  </span>
                )}
              </div>

              {book.photos.length > 1 && (
                <div className="flex items-center gap-4 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    aria-label="Previous plate"
                    className="text-neutral-400 hover:text-white bg-transparent border-0 p-1 cursor-pointer transition-colors"
                  >
                    ←
                  </button>
                  <span className="text-neutral-400 tabular-nums">
                    {String(selectedPhotoIndex + 1).padStart(2, '0')} / {String(book.photos.length).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    aria-label="Next plate"
                    className="text-neutral-400 hover:text-white bg-transparent border-0 p-1 cursor-pointer transition-colors"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
