import { apiRequest } from './http';
import type { CartLine, CheckoutDetails, StoreVendor, TrackedOrder, VendorSummary } from '../../storefront/types';

const id = (value: string) => encodeURIComponent(value);

export const storefrontApi = {
  vendors(signal?: AbortSignal) {
    return apiRequest<{ vendors: VendorSummary[] }>('/api/vendors', { signal });
  },

  vendor(slug: string, signal?: AbortSignal) {
    return apiRequest<{ vendor: StoreVendor }>(`/api/vendors/${id(slug)}`, { signal });
  },

  placeOrder(slug: string, details: CheckoutDetails, lines: CartLine[]) {
    return apiRequest<{ order: TrackedOrder | null }>(`/api/vendors/${id(slug)}/orders`, {
      method: 'POST',
      body: {
        ...details,
        address: details.fulfilment === 'DELIVERY' ? details.address : '',
        items: lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity })),
      },
    });
  },

  order(orderId: string, signal?: AbortSignal) {
    return apiRequest<{ order: TrackedOrder }>(`/api/orders/${id(orderId)}`, { signal });
  },

  cancelOrder(orderId: string) {
    return apiRequest<{ order: TrackedOrder }>(`/api/orders/${id(orderId)}/cancel`, { method: 'POST' });
  },
};
