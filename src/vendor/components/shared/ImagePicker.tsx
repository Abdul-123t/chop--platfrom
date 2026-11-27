import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { labelClass, mutedText } from '../../../components/ui/styles';
import { resizeImage } from '../../../utils/image';

interface ImagePickerProps {
  label: string;
  value: string;
  shape: 'square' | 'wide' | 'round';
  maxSide: number;
  hint?: string;
  onUpload: (file: Blob) => Promise<boolean>;
  onRemove?: () => void;
}

const SHAPES = {
  square: 'w-28 h-28 rounded-2xl',
  round: 'w-24 h-24 rounded-full',
  wide: 'w-full aspect-[3/1] rounded-2xl',
};

export function ImagePicker({ label, value, shape, maxSide, hint, onUpload, onRemove }: ImagePickerProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const resized = await resizeImage(file, maxSide);
      await onUpload(resized);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not use that photo.');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className={`flex ${shape === 'wide' ? 'flex-col' : 'items-center'} gap-3`}>
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          aria-label={value ? `Change ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
          className={`${SHAPES[shape]} relative shrink-0 overflow-hidden border border-dashed border-[#0E0D0B]/20 dark:border-white/20 bg-[#0E0D0B]/[0.04] dark:bg-white/[0.04] flex items-center justify-center cursor-pointer hover:border-[#E8772E] transition-colors`}
        >
          {value ? (
            <img src={value} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <ImagePlus className={`w-6 h-6 ${mutedText}`} aria-hidden="true" />
          )}
          {busy && (
            <span className="absolute inset-0 bg-[#0E0D0B]/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" aria-hidden="true" />
            </span>
          )}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="rounded-full border border-[#0E0D0B]/15 dark:border-white/15 px-3 py-1.5 text-[12px] font-semibold hover:border-[#E8772E] cursor-pointer"
          >
            {value ? 'Change photo' : 'Upload photo'}
          </button>
          {value && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[12px] font-semibold hover:text-[#DC2626] cursor-pointer ${mutedText}`}
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>
      {error ? (
        <div className="mt-1 text-[12px] font-medium text-[#B91C1C] dark:text-[#F87171]">{error}</div>
      ) : (
        hint && <div className={`mt-1 text-[12px] ${mutedText}`}>{hint}</div>
      )}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
