import { mutedText } from '../../components/ui/styles';
import type { LiveStatus } from '../hooks/useAdminEvents';

const META: Record<LiveStatus, { label: string; dot: string }> = {
  live: { label: 'Live', dot: 'bg-[#3FA66B] animate-pulse' },
  connecting: { label: 'Connecting', dot: 'bg-[#E8772E]' },
  offline: { label: 'Reconnecting', dot: 'bg-[#DC2626]' },
};

interface LiveIndicatorProps {
  status: LiveStatus;
  className?: string;
}

export function LiveIndicator({ status, className = 'hidden sm:inline-flex' }: LiveIndicatorProps) {
  const meta = META[status];
  return (
    <span
      className={`${className} items-center gap-1.5 text-[12px] font-semibold ${mutedText}`}
      title={status === 'live' ? 'Updates appear automatically' : 'Live updates paused, retrying'}
    >
      <span className={`w-2 h-2 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
