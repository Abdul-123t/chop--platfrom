import { useEffect, useRef, useState } from 'react';
import { ApiError } from '../../services/api/http';
import { streamAdminEvents, type AdminEvent } from '../../services/api/events';

export type LiveStatus = 'connecting' | 'live' | 'offline';

const MAX_BACKOFF_MS = 30_000;

export function useAdminEvents(token: string, onEvent: (event: AdminEvent) => void, onUnauthorized: () => void) {
  const [status, setStatus] = useState<LiveStatus>('connecting');
  const handlers = useRef({ onEvent, onUnauthorized });

  useEffect(() => {
    handlers.current = { onEvent, onUnauthorized };
  });

  useEffect(() => {
    const controller = new AbortController();
    let attempt = 0;
    let timer: number | undefined;

    const connect = async () => {
      setStatus('connecting');
      try {
        await streamAdminEvents(
          token,
          controller.signal,
          () => {
            attempt = 0;
            setStatus('live');
          },
          (event) => handlers.current.onEvent(event)
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof ApiError && error.status === 401) {
          handlers.current.onUnauthorized();
          return;
        }
      }
      if (controller.signal.aborted) return;
      setStatus('offline');
      attempt += 1;
      timer = window.setTimeout(connect, Math.min(MAX_BACKOFF_MS, 1000 * 2 ** attempt));
    };

    void connect();
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [token]);

  return status;
}
