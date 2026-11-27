import { apiRequest } from './http';
import type {
  MenuCategory,
  MenuItem,
  MenuItemInput,
  OrderScope,
  OverviewState,
  ProfileState,
  ProfileUpdate,
  SetupAccount,
  StatusChange,
  UploadKind,
  VendorMenu,
  VendorOrder,
  VendorSession,
} from '../../vendor/types';

const id = (value: string) => encodeURIComponent(value);

export const vendorApi = {
  login(identifier: string, password: string) {
    return apiRequest<VendorSession>('/api/vendor/session', { method: 'POST', body: { identifier, password } });
  },

  checkSession(token: string) {
    return apiRequest<{ authenticated: boolean; businessName: string; slug: string }>('/api/vendor/session', { token });
  },

  inspectSetup(token: string) {
    return apiRequest<{ account: SetupAccount }>('/api/vendor/setup/check', { method: 'POST', body: { token } });
  },

  completeSetup(token: string, password: string) {
    return apiRequest<VendorSession>('/api/vendor/setup', { method: 'POST', body: { token, password } });
  },

  forgot(identifier: string) {
    return apiRequest<{ sent: boolean }>('/api/vendor/forgot', { method: 'POST', body: { identifier } });
  },

  changePassword(token: string, currentPassword: string, newPassword: string) {
    return apiRequest<VendorSession>('/api/vendor/password', {
      method: 'POST',
      token,
      body: { currentPassword, newPassword },
    });
  },

  overview(token: string, signal?: AbortSignal) {
    return apiRequest<OverviewState>('/api/vendor/overview', { token, signal });
  },

  updateProfile(token: string, update: ProfileUpdate) {
    return apiRequest<ProfileState>('/api/vendor/profile', { method: 'PATCH', token, body: update });
  },

  upload(token: string, kind: UploadKind, file: Blob) {
    const form = new FormData();
    form.append('kind', kind);
    form.append('file', file, `${kind}.${file.type.split('/')[1] ?? 'jpg'}`);
    return apiRequest<{ url: string } & Partial<ProfileState>>('/api/vendor/uploads', { method: 'POST', token, form });
  },

  menu(token: string, signal?: AbortSignal) {
    return apiRequest<{ menu: VendorMenu }>('/api/vendor/menu', { token, signal });
  },

  createCategory(token: string, name: string) {
    return apiRequest<{ category: MenuCategory }>('/api/vendor/menu/categories', { method: 'POST', token, body: { name } });
  },

  updateCategory(token: string, categoryId: string, update: Partial<Pick<MenuCategory, 'name' | 'position'>>) {
    return apiRequest<{ category: MenuCategory }>(`/api/vendor/menu/categories/${id(categoryId)}`, {
      method: 'PATCH',
      token,
      body: update,
    });
  },

  deleteCategory(token: string, categoryId: string) {
    return apiRequest<{ deleted: boolean }>(`/api/vendor/menu/categories/${id(categoryId)}`, { method: 'DELETE', token });
  },

  createItem(token: string, input: MenuItemInput) {
    return apiRequest<{ item: MenuItem }>('/api/vendor/menu/items', { method: 'POST', token, body: input });
  },

  updateItem(token: string, itemId: string, update: Partial<MenuItemInput & { position: number }>) {
    return apiRequest<{ item: MenuItem }>(`/api/vendor/menu/items/${id(itemId)}`, { method: 'PATCH', token, body: update });
  },

  deleteItem(token: string, itemId: string) {
    return apiRequest<{ deleted: boolean }>(`/api/vendor/menu/items/${id(itemId)}`, { method: 'DELETE', token });
  },

  orders(token: string, scope: OrderScope, signal?: AbortSignal) {
    return apiRequest<{ orders: VendorOrder[] }>(`/api/vendor/orders?scope=${scope}`, { token, signal });
  },

  updateOrder(token: string, orderId: string, change: StatusChange) {
    return apiRequest<{ order: VendorOrder }>(`/api/vendor/orders/${id(orderId)}`, { method: 'PATCH', token, body: change });
  },
};
