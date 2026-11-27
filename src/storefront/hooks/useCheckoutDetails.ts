import { useEffect, useState } from 'react';
import type { Fulfilment } from '../../utils/orderStatus';
import type { CheckoutDetails } from '../types';

const STORAGE_KEY = 'chop-checkout-details';

type Remembered = Pick<CheckoutDetails, 'customerName' | 'customerPhone' | 'customerEmail' | 'address'>;

function readRemembered(): Partial<Remembered> {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<Remembered>;
  } catch {
    return {};
  }
}

export function useCheckoutDetails(defaultFulfilment: Fulfilment) {
  const [details, setDetails] = useState<CheckoutDetails>(() => {
    const remembered = readRemembered();
    return {
      customerName: remembered.customerName ?? '',
      customerPhone: remembered.customerPhone ?? '',
      customerEmail: remembered.customerEmail ?? '',
      address: remembered.address ?? '',
      fulfilment: defaultFulfilment,
      note: '',
      website: '',
    };
  });

  useEffect(() => {
    try {
      const { customerName, customerPhone, customerEmail, address } = details;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ customerName, customerPhone, customerEmail, address }));
    } catch {
      return;
    }
  }, [details]);

  return [details, setDetails] as const;
}
