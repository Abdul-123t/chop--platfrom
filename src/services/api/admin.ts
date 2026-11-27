import { apiRequest } from './http';
import type {
  Audience,
  NewsletterContent,
  NewsletterLogEntry,
  PreviewResult,
  SessionResult,
  Subscriber,
  SubscribersOverview,
  SubscriberUpdate,
  VendorAccountResult,
} from '../../admin/types';

export const adminApi = {
  login(email: string, password: string) {
    return apiRequest<SessionResult>('/api/admin/session', { method: 'POST', body: { email, password } });
  },

  checkSession(token: string) {
    return apiRequest<{ authenticated: boolean; expiresAt: number }>('/api/admin/session', { token });
  },

  subscribers(token: string, signal?: AbortSignal) {
    return apiRequest<SubscribersOverview>('/api/admin/subscribers', { token, signal });
  },

  updateSubscriber(token: string, id: string, update: SubscriberUpdate) {
    return apiRequest<{ subscriber: Subscriber }>(`/api/admin/subscribers/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      token,
      body: update,
    });
  },

  deleteSubscriber(token: string, id: string) {
    return apiRequest<{ deleted: boolean }>(`/api/admin/subscribers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      token,
    });
  },

  newsletters(token: string, signal?: AbortSignal) {
    return apiRequest<{ newsletters: NewsletterLogEntry[] }>('/api/admin/newsletters', { token, signal });
  },

  preview(token: string, content: NewsletterContent) {
    return apiRequest<PreviewResult>('/api/admin/newsletters/preview', { method: 'POST', token, body: content });
  },

  sendTest(token: string, content: NewsletterContent, to: string) {
    return apiRequest<{ to: string }>('/api/admin/newsletters/test', {
      method: 'POST',
      token,
      body: { ...content, to },
    });
  },

  send(token: string, content: NewsletterContent, audience: Audience) {
    return apiRequest<{ newsletter: NewsletterLogEntry }>('/api/admin/newsletters', {
      method: 'POST',
      token,
      body: { ...content, audience },
    });
  },

  createVendorAccount(token: string, entryId: string) {
    return apiRequest<VendorAccountResult>('/api/admin/vendors', { method: 'POST', token, body: { entryId } });
  },

  vendorSetupLink(token: string, vendorId: string) {
    return apiRequest<VendorAccountResult>(`/api/admin/vendors/${encodeURIComponent(vendorId)}/setup-link`, {
      method: 'POST',
      token,
    });
  },

  emailVendorLink(token: string, vendorId: string) {
    return apiRequest<{ sentTo: string }>(`/api/admin/vendors/${encodeURIComponent(vendorId)}/email-link`, {
      method: 'POST',
      token,
    });
  },

  setVendorSuspended(token: string, vendorId: string, suspended: boolean) {
    return apiRequest<VendorAccountResult>(`/api/admin/vendors/${encodeURIComponent(vendorId)}`, {
      method: 'PATCH',
      token,
      body: { suspended },
    });
  },
};
