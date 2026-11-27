import React, { useState } from 'react';
import type { CustomerAddress, LocationArea } from '../../types';
import { card, errorBox, errorText, input, label, primaryButton, secondaryButton } from './accountStyles';

interface AddressFormProps {
  defaultArea: LocationArea;
  makeDefault: boolean;
  onSave: (address: Omit<CustomerAddress, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ defaultArea, makeDefault, onSave, onCancel }) => {
  const [addressLabel, setAddressLabel] = useState('Hostel');
  const [area, setArea] = useState<LocationArea>(defaultArea);
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [landmark, setLandmark] = useState('');
  const [directions, setDirections] = useState('');
  const [isDefault, setIsDefault] = useState(makeDefault);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (street.trim().length < 2 || landmark.trim().length < 2) {
      setError('Add the street and a landmark the rider will recognise.');
      return;
    }
    setPending(true);
    setError('');
    try {
      await onSave({
        label: addressLabel.trim() || 'Address',
        locationArea: area,
        street: street.trim(),
        hostelOrBuilding: building.trim() || undefined,
        landmark: landmark.trim(),
        directions: directions.trim() || undefined,
        isDefault,
      });
    } catch (caught) {
      setError(errorText(caught, 'Could not save this address.'));
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${card} p-4 space-y-3`}>
      <h3 className="font-display text-sm font-bold text-[#141414]">New address</h3>
      <div className="grid grid-cols-2 gap-2">
        <label className={label}>
          Label
          <input value={addressLabel} maxLength={40} onChange={(event) => setAddressLabel(event.target.value)} className={`${input} mt-1.5`} />
        </label>
        <label className={label}>
          Area
          <select value={area} onChange={(event) => setArea(event.target.value as LocationArea)} className={`${input} mt-1.5`}>
            <option value="ijebu-ode">Ijebu Ode</option>
            <option value="ijagun">Ijagun (TASUED)</option>
          </select>
        </label>
      </div>
      <label className={label}>
        Street or area
        <input value={street} maxLength={160} onChange={(event) => setStreet(event.target.value)} placeholder="e.g. 8 New Road" className={`${input} mt-1.5`} />
      </label>
      <label className={label}>
        Hostel, building or room (optional)
        <input value={building} maxLength={120} onChange={(event) => setBuilding(event.target.value)} placeholder="e.g. Excellence Hostel, Room 12" className={`${input} mt-1.5`} />
      </label>
      <label className={label}>
        Landmark
        <input value={landmark} maxLength={160} onChange={(event) => setLandmark(event.target.value)} placeholder="e.g. Opposite Bovas Filling Station" className={`${input} mt-1.5`} />
      </label>
      <label className={label}>
        Directions (optional)
        <input value={directions} maxLength={300} onChange={(event) => setDirections(event.target.value)} placeholder="e.g. Blue gate, second floor" className={`${input} mt-1.5`} />
      </label>
      <label className="flex items-center gap-2 text-xs font-semibold text-[#191919]">
        <input type="checkbox" checked={isDefault} onChange={(event) => setIsDefault(event.target.checked)} className="accent-[#141414] w-4 h-4" />
        Use as my default address
      </label>
      {error && <p className={errorBox}>{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? 'Saving…' : 'Save address'}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
};
