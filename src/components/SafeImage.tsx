import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { CHOP_CONFIG } from '../config';

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#241E19] via-[#171411] to-[#0E0D0B] text-[#A89F92] p-4 text-center ${className}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-16 font-display text-6xl font-semibold tracking-[0.3em] text-white/[0.04]"
        >
          {CHOP_CONFIG.brandName}
        </span>
        <UtensilsCrossed className="w-6 h-6 text-[#E8772E] mb-2" aria-hidden="true" />
        <span className="font-display text-xs font-semibold tracking-[0.3em] text-[#F7F1E8]/55">
          {CHOP_CONFIG.brandName}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
