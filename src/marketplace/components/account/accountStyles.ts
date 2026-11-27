import type { OrderStatus } from '../../types';

export const card = 'bg-white rounded-2xl border border-[#E6E2DA]';

export const input =
  'w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-sm text-[#191919] placeholder-[#77736C] focus:outline-none focus:border-[#141414] focus:ring-2 focus:ring-[#141414]/10';

export const label = 'block text-xs font-bold text-[#141414] mb-1.5';

export const primaryButton =
  'inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

export const secondaryButton =
  'inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white border border-[#E6E2DA] text-[#191919] text-xs font-semibold hover:border-[#141414] disabled:opacity-50 transition-colors';

export const errorBox = 'text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3';

export const successBox = 'text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3';

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  pending_acceptance: { label: 'Waiting for vendor', tone: 'bg-amber-100 text-amber-800' },
  accepted: { label: 'Accepted', tone: 'bg-[#C45B3A]/10 text-[#C45B3A]' },
  preparing: { label: 'Preparing', tone: 'bg-[#C45B3A]/10 text-[#C45B3A]' },
  ready_for_pickup: { label: 'Ready', tone: 'bg-emerald-100 text-emerald-800' },
  out_for_delivery: { label: 'On the way', tone: 'bg-emerald-100 text-emerald-800' },
  completed: { label: 'Completed', tone: 'bg-[#F0EEE8] text-[#141414]' },
  cancelled: { label: 'Cancelled', tone: 'bg-red-100 text-red-800' },
};

export function isOpenOrder(status: OrderStatus): boolean {
  return status !== 'completed' && status !== 'cancelled';
}

export function errorText(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
