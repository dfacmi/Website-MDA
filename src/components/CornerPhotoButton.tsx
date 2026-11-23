import { useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { compressImageFile } from '../utils/imageStorage';

interface CornerPhotoButtonProps {
  label?: string;
  maxDimension?: number;
  onSelectPhoto: (dataUrl: string) => void | Promise<void>;
}

export function CornerPhotoButton({
  label = 'Tambah Foto',
  maxDimension = 960,
  onSelectPhoto,
}: CornerPhotoButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  const stop = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await compressImageFile(file, maxDimension);
      await onSelectPhoto(dataUrl);
    } catch {
      // Invalid or unreadable file ignored cleanly.
    } finally {
      setBusy(false);
    }
  };

  return (
    <div onClick={stop} className="absolute top-2 right-2 z-10">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        aria-label={label}
        className="sr-only"
      />

      <button
        type="button"
        disabled={busy}
        onClick={handleClick}
        title={label}
        aria-label={label}
        className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#0F1F1C]/75 hover:bg-[#0F1F1C] text-white border border-white/15 backdrop-blur-xs transition-colors shrink-0"
      >
        {busy ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
