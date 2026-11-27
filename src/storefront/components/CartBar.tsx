import { ShoppingBag } from 'lucide-react';
import { formatNaira } from '../../utils/money';

interface CartBarProps {
  count: number;
  subtotal: number;
  onOpen: () => void;
}

export function CartBar({ count, subtotal, onOpen }: CartBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-[#F7F1E8] dark:from-[#0E0D0B] to-transparent">
      <button
        type="button"
        onClick={onOpen}
        className="w-full max-w-[640px] mx-auto flex items-center gap-3 rounded-full bg-[#E8772E] text-[#0E0D0B] pl-4 pr-5 py-3 shadow-xl hover:bg-[#B9441A] cursor-pointer"
      >
        <span className="relative">
          <ShoppingBag className="w-5 h-5" aria-hidden="true" />
          <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#0E0D0B] text-[#F7F1E8] text-[11px] font-bold inline-flex items-center justify-center">
            {count}
          </span>
        </span>
        <span className="flex-1 text-left text-[15px] font-extrabold">View order</span>
        <span className="text-[15px] font-extrabold tabular-nums">{formatNaira(subtotal)}</span>
      </button>
    </div>
  );
}
