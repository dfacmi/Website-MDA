import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { GALLERY_PHOTOS } from '../data/mdaContent';
import { CornerPhotoButton } from './CornerPhotoButton';
import { SafeImage } from './SafeImage';

export function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { photos: customPhotos, savePhoto } = usePhotos();

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
    );
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % GALLERY_PHOTOS.length));
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, closeLightbox, showPrev, showNext]);

  const getSlotKey = (photoId: string) => `gallery_${photoId}`;

  const handleUploadPhoto = (photoId: string, dataUrl: string) =>
    savePhoto(getSlotKey(photoId), dataUrl);

  const activePhoto = selectedIndex !== null ? GALLERY_PHOTOS[selectedIndex] : null;
  const activeSrc =
    activePhoto !== null
      ? (customPhotos[getSlotKey(activePhoto.id)] ?? activePhoto.src)
      : '';

  return (
    <div>
      <section className="bg-[#FAFBFA] border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-medium text-[#0B6B53]">Galeri Foto · 12 Dokumentasi</p>
            <h1 className="font-display font-bold tracking-tight text-[#0F1F1C] leading-[1.14] text-[clamp(2rem,3.8vw,3.25rem)]">
              Dokumentasi kegiatan MDA
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-[#475A54]">
              Ruang untuk menampilkan aktivitas siswa, event sekolah, dan hasil karya digital.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GALLERY_PHOTOS.map((photo, index) => {
              const slotKey = getSlotKey(photo.id);
              const customSrc = customPhotos[slotKey];
              return (
                <div
                  key={photo.id}
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#E2E8E5] bg-[#EEF2F0]"
                >
                  <CornerPhotoButton
                    label="Tambah Foto"
                    maxDimension={840}
                    onSelectPhoto={(dataUrl) => handleUploadPhoto(photo.id, dataUrl)}
                  />

                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`Lihat foto dokumentasi ${index + 1} dari ${GALLERY_PHOTOS.length}`}
                    className="block w-full h-full focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0B6B53]"
                  >
                    <SafeImage
                      src={customSrc ?? photo.src}
                      alt={photo.alt}
                      loading={index < 6 ? 'eager' : 'lazy'}
                      fallbackLabel="Dokumentasi MDA"
                      className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activePhoto && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau foto dokumentasi"
          className="fixed inset-0 z-50 bg-[#0F1F1C]/92 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white">
              <span className="font-mono text-xs text-white/80 tabular-nums">
                {String(selectedIndex + 1).padStart(2, '0')} /{' '}
                {String(GALLERY_PHOTOS.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Tutup pratinjau foto"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full flex items-center justify-center">
              <button
                type="button"
                onClick={showPrev}
                aria-label="Foto sebelumnya"
                className="absolute left-2 sm:-left-14 z-10 inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#0F1F1C]/80 hover:bg-[#0F1F1C] border border-white/15 text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="w-full max-h-[78vh] overflow-hidden rounded-xl border border-white/15 bg-[#0F1F1C]">
                <SafeImage
                  src={activeSrc}
                  alt={activePhoto.alt}
                  loading="eager"
                  className="w-full max-h-[78vh] object-contain"
                />
              </div>

              <button
                type="button"
                onClick={showNext}
                aria-label="Foto berikutnya"
                className="absolute right-2 sm:-right-14 z-10 inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#0F1F1C]/80 hover:bg-[#0F1F1C] border border-white/15 text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
