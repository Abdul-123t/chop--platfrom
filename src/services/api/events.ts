import { apiUrl } from './env';
import { ApiError } from './http';

export type AdminEventType =
  | 'entry.created'
  | 'entry.updated'
  | 'entry.deleted'
  | 'preferences.updated'
  | 'newsletter.sent';

export interface AdminEvent {
  type: AdminEventType;
  id?: string;
  at: string;
}

function parseBlock(block: string): AdminEvent | null {
  const data = block
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .join('\n');
  if (!data) return null;
  try {
    return JSON.parse(data) as AdminEvent;
  } catch {
    return null;
  }
}

export async function streamAdminEvents(
  token: string,
  signal: AbortSignal,
  onOpen: () => void,
  onEvent: (event: AdminEvent) => void
): Promise<void> {
  const response = await fetch(apiUrl('/api/admin/events'), {
    headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
    signal,
  });
  if (!response.ok || !response.body) {
    throw new ApiError(response.status, 'Live updates are unavailable.');
  }

  onOpen();
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) return;
    buffer += value.replace(/\r\n/g, '\n');
    let boundary = buffer.indexOf('\n\n');
    while (boundary >= 0) {
      const event = parseBlock(buffer.slice(0, boundary));
      buffer = buffer.slice(boundary + 2);
      if (event) onEvent(event);
      boundary = buffer.indexOf('\n\n');
    }
  }
}
