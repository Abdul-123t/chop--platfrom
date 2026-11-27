import React from 'react';
import { ArrowRight, MapPin, Receipt, Store } from 'lucide-react';
import { formatNaira } from '../../lib/constants';
import { useStore } from '../../lib/store';
import { card, isOpenOrder } from './accountStyles';
import { AccountOrderCard } from './AccountOrderCard';

export const AccountOverview: React.FC = () => {
  const { orders, savedAddresses, setAccountTab, setActiveView } = useStore();
  const active = orders.filter((order) => isOpenOrder(order.status));
  const completed = orders.filter((order) => order.status === 'completed');
  const spent = completed.reduce((sum, order) => sum + order.total, 0);
  const defaultAddress = savedAddresses.find((address) => address.isDefault) ?? savedAddresses[0];

  const stats = [
    { label: 'In progress', value: String(active.length) },
    { label: 'Completed', value: String(completed.length) },
    { label: 'Spent on CHOP', value: formatNaira(spent) },
  ];

  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className={`${card} p-3 min-w-0`}>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-[#77736C] truncate">{stat.label}</dt>
            <dd className="font-display text-lg font-extrabold text-[#141414] truncate">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-[#141414]">Orders in progress</h2>
          <button type="button" onClick={() => setAccountTab('orders')} className="text-xs font-semibold text-[#C45B3A] hover:underline">
            All orders
          </button>
        </div>
        {active.length === 0 ? (
          <div className={`${card} p-6 text-center space-y-3`}>
            <Receipt className="w-6 h-6 text-[#C45B3A] mx-auto" />
            <p className="text-sm text-[#77736C]">Nothing cooking right now.</p>
            <button
              type="button"
              onClick={() => setActiveView('marketplace')}
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black"
            >
              <Store className="w-3.5 h-3.5" />
              Find food spots
            </button>
          </div>
        ) : (
          active.map((order) => <AccountOrderCard key={order.id} order={order} />)
        )}
      </section>

      <button
        type="button"
        onClick={() => setAccountTab('addresses')}
        className={`${card} w-full p-4 flex items-center gap-3 text-left hover:border-[#141414] transition-colors`}
      >
        <span className="w-9 h-9 rounded-xl bg-[#F0EEE8] flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-[#C45B3A]" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-xs font-bold text-[#141414]">Delivery address</span>
          <span className="block text-xs text-[#77736C] truncate">
            {defaultAddress
              ? `${defaultAddress.label}: ${[defaultAddress.hostelOrBuilding, defaultAddress.street].filter(Boolean).join(', ')}`
              : 'Save a hostel or home address for faster checkout'}
          </span>
        </span>
        <ArrowRight className="w-4 h-4 text-[#77736C] shrink-0" />
      </button>
    </div>
  );
};
