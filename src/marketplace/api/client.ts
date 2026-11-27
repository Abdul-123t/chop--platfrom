import { apiRequest } from '../../services/api/http';
import type {
  ApplicationStatusDto,
  CustomerAddressDto,
  CustomerDto,
  CustomerSessionDto,
  MarketplaceVendorDto,
  OrderDto,
  OrderRequest,
} from './types';

const id = (value: string) => encodeURIComponent(value);

export const marketplaceApi = {
  vendors(signal?: AbortSignal) {
    return apiRequest<{ vendors: MarketplaceVendorDto[] }>('/api/marketplace', { signal });
  },

  placeOrder(slug: string, order: OrderRequest, token?: string) {
    return apiRequest<{ order: OrderDto | null }>(`/api/vendors/${id(slug)}/orders`, { method: 'POST', body: order, token });
  },

  order(orderId: string, signal?: AbortSignal) {
    return apiRequest<{ order: OrderDto }>(`/api/orders/${id(orderId)}`, { signal });
  },

  register(input: { fullName: string; email: string; phone: string; password: string; preferredArea: string }) {
    return apiRequest<CustomerSessionDto>('/api/customer/register', { method: 'POST', body: input });
  },

  login(identifier: string, password: string) {
    return apiRequest<CustomerSessionDto>('/api/customer/session', { method: 'POST', body: { identifier, password } });
  },

  me(token: string) {
    return apiRequest<{ customer: CustomerDto }>('/api/customer/session', { token });
  },

  forgot(identifier: string) {
    return apiRequest<{ sent: boolean }>('/api/customer/forgot', { method: 'POST', body: { identifier } });
  },

  reset(token: string, password: string) {
    return apiRequest<CustomerSessionDto>('/api/customer/reset', { method: 'POST', body: { token, password } });
  },

  customerOrders(token: string, signal?: AbortSignal) {
    return apiRequest<{ orders: OrderDto[] }>('/api/customer/orders', { token, signal });
  },

  addresses(token: string) {
    return apiRequest<{ addresses: CustomerAddressDto[] }>('/api/customer/addresses', { token });
  },

  addAddress(token: string, address: Omit<CustomerAddressDto, 'id'>) {
    return apiRequest<{ address: CustomerAddressDto }>('/api/customer/addresses', { method: 'POST', token, body: address });
  },

  deleteAddress(token: string, addressId: string) {
    return apiRequest<{ deleted: boolean }>(`/api/customer/addresses/${id(addressId)}`, { method: 'DELETE', token });
  },

  applyAsVendor(payload: Record<string, unknown>) {
    return apiRequest<{ id: string; duplicate: boolean }>('/api/waitlist', { method: 'POST', body: payload });
  },

  applicationStatus(phone: string) {
    return apiRequest<{ application: ApplicationStatusDto | null }>('/api/vendor-applications/status', {
      method: 'POST',
      body: { phone },
    });
  },
};
