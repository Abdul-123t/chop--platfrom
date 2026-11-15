import { apiRequest } from './http';

export function unsubscribe(token: string) {
  return apiRequest<{ unsubscribed: boolean }>('/api/unsubscribe', { method: 'POST', body: { token } });
}
