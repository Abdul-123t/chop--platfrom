import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../services/api/http';

type Loader<T> = (token: string, signal: AbortSignal) => Promise<T>;

export function useAdminQuery<T>(token: string, loader: Loader<T>, onUnauthorized: () => void) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    loader(token, controller.signal)
      .then((result) => setData(result))
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return;
        if (caught instanceof ApiError && caught.status === 401) {
          onUnauthorized();
          return;
        }
        setError(caught instanceof Error ? caught.message : 'Could not load data.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [token, version, loader, onUnauthorized]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return { data, error, loading, reload };
}
