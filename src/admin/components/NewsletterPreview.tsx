import type { PreviewResult } from '../types';
import { mutedText } from '../../components/ui/styles';

export function NewsletterPreview({ preview }: { preview: PreviewResult | null }) {
  if (!preview) {
    return (
      <div className={`flex items-center justify-center h-[420px] rounded-xl border border-dashed border-[#0E0D0B]/15 dark:border-white/12 text-[13px] ${mutedText}`}>
        Write a subject and message, then press Preview.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-[13px]">
        <span className={mutedText}>Subject: </span>
        <span className="font-semibold">{preview.subject}</span>
      </div>
      <iframe
        title="Newsletter preview"
        sandbox=""
        srcDoc={preview.html}
        className="w-full h-[420px] rounded-xl border border-[#0E0D0B]/10 dark:border-white/[0.08] bg-[#F7F1E8]"
      />
    </div>
  );
}
