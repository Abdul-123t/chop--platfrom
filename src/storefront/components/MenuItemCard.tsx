import { Plus } from 'lucide-react';
import { mutedText } from '../../components/ui/styles';
import { formatNaira } from '../../utils/money';
import type { StoreItem } from '../types';
import { QuantityStepper } from './QuantityStepper';

interface MenuItemCardProps {
  item: StoreItem;
  quantity: number;
  canOrder: boolean;
  onChange: (quantity: number) => void;
}

export function MenuItemCard({ item, quantity, canOrder, onChange }: MenuItemCardProps) {
  const orderable = canOrder && item.available;

  return (
    <li className={`flex gap-3 py-3 ${item.available ? '' : 'opacity-55'}`}>
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-[15px] font-bold leading-tight">{item.name}</h3>
        {item.description && <p className={`text-[13px] line-clamp-2 ${mutedText}`}>{item.description}</p>}
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-extrabold tabular-nums">{formatNaira(item.price)}</span>
          {!item.available && <span className="text-[12px] font-semibold text-[#B91C1C] dark:text-[#F87171]">Sold out</span>}
        </div>
      </div>
      <div className="relative shrink-0 flex flex-col items-end justify-between gap-2">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.name} loading="lazy" className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover" />
        )}
        {orderable &&
          (quantity > 0 ? (
            <QuantityStepper quantity={quantity} label={item.name} onChange={onChange} compact />
          ) : (
            <button
              type="button"
              onClick={() => onChange(1)}
              aria-label={`Add ${item.name}`}
              className={`${item.imageUrl ? 'absolute -bottom-2 right-2' : ''} inline-flex items-center gap-1 rounded-full bg-[#E8772E] text-[#0E0D0B] px-3 py-1.5 text-[13px] font-bold shadow-md hover:bg-[#B9441A] cursor-pointer`}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Add
            </button>
          ))}
      </div>
    </li>
  );
}
