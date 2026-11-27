import { ArrowRight, Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { mutedText } from '../../../components/ui/styles';
import type { ReadinessItem, VendorSection } from '../../types';

const TARGETS: Record<string, VendorSection> = {
  name: 'profile',
  menu: 'menu',
  hours: 'profile',
  fulfilment: 'profile',
  contact: 'profile',
};

interface SetupChecklistProps {
  checklist: ReadinessItem[];
  onNavigate: (section: VendorSection) => void;
}

export function SetupChecklist({ checklist, onNavigate }: SetupChecklistProps) {
  const done = checklist.filter((item) => item.done).length;
  return (
    <Card title={`Get ready to go live · ${done}/${checklist.length}`}>
      <div className="h-1.5 rounded-full bg-[#0E0D0B]/10 dark:bg-white/10 overflow-hidden mb-3">
        <div className="h-full bg-[#3FA66B] transition-all" style={{ width: `${(done / Math.max(1, checklist.length)) * 100}%` }} />
      </div>
      <ul className="space-y-1">
        {checklist.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              disabled={item.done}
              onClick={() => onNavigate(TARGETS[item.key] ?? 'profile')}
              className="w-full flex items-center gap-2.5 rounded-xl px-2 py-2 text-left hover:bg-[#0E0D0B]/[0.04] dark:hover:bg-white/[0.04] disabled:hover:bg-transparent cursor-pointer disabled:cursor-default"
            >
              <span
                className={`w-5 h-5 shrink-0 rounded-full inline-flex items-center justify-center ${
                  item.done ? 'bg-[#3FA66B] text-white' : 'border-2 border-[#0E0D0B]/20 dark:border-white/20'
                }`}
              >
                {item.done && <Check className="w-3 h-3" aria-hidden="true" />}
              </span>
              <span className={`flex-1 text-[14px] ${item.done ? `line-through ${mutedText}` : 'font-semibold'}`}>{item.label}</span>
              {!item.done && <ArrowRight className={`w-4 h-4 ${mutedText}`} aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
