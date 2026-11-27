import React, { useState } from 'react';
import { Receipt } from 'lucide-react';
import { useStore } from '../../lib/store';
import { card, isOpenOrder } from './accountStyles';
import { AccountOrderCard } from './AccountOrderCard';

type Filter = 'active' | 'past' | 'all';

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'active', label: 'In progress' },
  { value: 'past', label: 'Past' },
  { value: 'all', label: 'All' },
];

export const AccountOrders: React.FC = () => {
  const { orders, setActiveView } = useStore();
  const [filter, setFilter] = useState<Filter>(() => (orders.some((order) => isOpenOrder(order.status)) ? 'active' : 'all'));

  const shown = orders.filter((order) =>
    filter === 'all' ? true : filter === 'active' ? isOpenOrder(order.status) : !isOpenOrder(order.status)
  );

  return (
    <div className="space-y-3">
      <div className="inline-flex p-1 rounded-full bg-white border border-[#E6E2DA]">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-colors ${
              filter === option.value ? 'bg-[#141414] text-white' : 'text-[#77736C] hover:text-[#141414]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className={`${card} p-8 text-center space-y-3`}>
          <Receipt className="w-6 h-6 text-[#C45B3A] mx-auto" />
          <p className="text-sm text-[#77736C]">
            {orders.length === 0 ? 'You have not ordered on CHOP yet.' : 'No orders here.'}
          </p>
          {orders.length === 0 && (
            <button
              type="button"
              onClick={() => setActiveView('marketplace')}
              className="py-2 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black"
            >
              Find food spots
            </button>
          )}
        </div>
      ) : (
        shown.map((order) => <AccountOrderCard key={order.id} order={order} />)
      )}
    </div>
  );
};
