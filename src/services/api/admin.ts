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
};
