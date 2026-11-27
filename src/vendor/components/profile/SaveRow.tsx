import { Check, Save } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';

interface SaveRowProps {
  dirty: boolean;
  pending: boolean;
  error: string | null;
  saved: boolean;
}

export function SaveRow({ dirty, pending, error, saved }: SaveRowProps) {
  return (
    <div className="space-y-2 pt-1">
      {error && <Alert tone="error">{error}</Alert>}
      <div className="flex items-center justify-end gap-2">
        {saved && !dirty && (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2E7D50] dark:text-[#3FA66B]">
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            Saved
          </span>
        )}
        <Button type="submit" loading={pending} disabled={!dirty} icon={<Save className="w-3.5 h-3.5" aria-hidden="true" />}>
          Save
        </Button>
      </div>
    </div>
  );
}
