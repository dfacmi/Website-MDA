import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'eager' | 'lazy';
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackLabel,
  loading = 'lazy',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-[#EEF2F0] text-[#475A54] p-6 text-center ${className}`}
      >
        <ImageIcon className="w-6 h-6 text-[#0B6B53]/70" strokeWidth={1.6} aria-hidden="true" />
        {fallbackLabel && (
          <span className="text-xs font-medium tracking-tight text-[#475A54]">{fallbackLabel}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
