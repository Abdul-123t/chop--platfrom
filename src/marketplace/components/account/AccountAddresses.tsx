import React, { useState } from 'react';
import { MapPin, Plus, Star, Trash2 } from 'lucide-react';
import { SERVICE_LOCATIONS } from '../../lib/constants';
import { useStore } from '../../lib/store';
import { card, errorBox, errorText, primaryButton } from './accountStyles';
import { AddressForm } from './AddressForm';

export const AccountAddresses: React.FC = () => {
  const { savedAddresses, addAddress, deleteAddress, setDefaultAddress, currentUser, selectedLocation } = useStore();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const run = async (task: () => Promise<void>) => {
    setError('');
    try {
      await task();
    } catch (caught) {
      setError(errorText(caught, 'Something went wrong. Please try again.'));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[#77736C]">Saved addresses fill in at checkout so riders find you fast.</p>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className={primaryButton}>
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        )}
      </div>

      {adding && (
        <AddressForm
          defaultArea={currentUser?.preferredLocation ?? selectedLocation}
          makeDefault={savedAddresses.length === 0}
          onCancel={() => setAdding(false)}
          onSave={async (address) => {
            await addAddress(address);
            setAdding(false);
          }}
        />
      )}

      {error && <p className={errorBox}>{error}</p>}

      {savedAddresses.length === 0 && !adding ? (
        <div className={`${card} p-8 text-center space-y-2`}>
          <MapPin className="w-6 h-6 text-[#C45B3A] mx-auto" />
          <p className="text-sm text-[#77736C]">No saved addresses yet.</p>
        </div>
      ) : (
        savedAddresses.map((address) => (
          <div key={address.id} className={`${card} p-4 flex items-start justify-between gap-3 text-xs`}>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display font-bold text-sm text-[#141414]">{address.label}</span>
                <span className="text-[10px] text-[#C45B3A] bg-[#C45B3A]/10 px-1.5 py-0.5 rounded font-semibold">
                  {SERVICE_LOCATIONS[address.locationArea].name}
                </span>
                {address.isDefault && (
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-semibold">Default</span>
                )}
              </div>
              <p className="text-[#191919] font-medium break-words">
                {[address.hostelOrBuilding, address.street].filter(Boolean).join(', ')}
              </p>
              <p className="text-[#77736C] break-words">Landmark: {address.landmark}</p>
              {address.directions && <p className="text-[#77736C] break-words">{address.directions}</p>}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() => void run(() => setDefaultAddress(address.id))}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#77736C] hover:text-[#141414] p-1"
                >
                  <Star className="w-3.5 h-3.5" />
                  Make default
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${address.label}"?`)) deleteAddress(address.id);
                }}
                className="text-[#77736C] hover:text-red-600 p-1"
                aria-label={`Delete ${address.label}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
