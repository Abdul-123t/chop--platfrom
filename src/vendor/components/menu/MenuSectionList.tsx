import { ImageOff, Pencil, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { mutedText } from '../../../components/ui/styles';
import { formatNaira } from '../../../utils/money';
import type { MenuItem } from '../../types';
import type { MenuGroup } from './MenuPage';

interface MenuSectionListProps {
  groups: MenuGroup[];
  onAdd: (categoryId: string | null) => void;
  onEdit: (item: MenuItem) => void;
  onToggle: (item: MenuItem, available: boolean) => void;
}

export function MenuSectionList({ groups, onAdd, onEdit, onToggle }: MenuSectionListProps) {
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <Card
          key={group.id ?? 'none'}
          title={`${group.name} · ${group.items.length}`}
          actions={
            <button
              type="button"
              onClick={() => onAdd(group.id)}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold text-[#E8772E] hover:bg-[#E8772E]/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Add
            </button>
          }
        >
          {group.items.length === 0 ? (
            <div className={`py-3 text-[13px] ${mutedText}`}>No items in this category yet.</div>
          ) : (
            <ul className="divide-y divide-[#0E0D0B]/[0.06] dark:divide-white/[0.06]">
              {group.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="flex flex-1 min-w-0 items-center gap-3 text-left cursor-pointer group"
                  >
                    <span className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-[#0E0D0B]/[0.06] dark:bg-white/[0.06] flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <ImageOff className={`w-4 h-4 ${mutedText}`} aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[14px] font-semibold truncate group-hover:text-[#E8772E] ${item.available ? '' : 'line-through opacity-60'}`}>
                        {item.name}
                      </span>
                      <span className="block text-[13px] font-bold tabular-nums">{formatNaira(item.price)}</span>
                      {item.description && <span className={`block text-[12px] truncate ${mutedText}`}>{item.description}</span>}
                    </span>
                    <Pencil className={`w-3.5 h-3.5 shrink-0 ${mutedText}`} aria-hidden="true" />
                  </button>
                  <label className="flex flex-col items-center gap-0.5 shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      role="switch"
                      checked={item.available}
                      onChange={(event) => onToggle(item, event.target.checked)}
                      aria-label={`${item.name} available`}
                      className="sr-only peer"
                    />
                    <span className="relative w-10 h-6 rounded-full bg-[#0E0D0B]/20 dark:bg-white/20 peer-checked:bg-[#3FA66B] transition-colors after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-[#E8772E]" />
                    <span className={`text-[10px] font-semibold ${mutedText}`}>{item.available ? 'Available' : 'Sold out'}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}
