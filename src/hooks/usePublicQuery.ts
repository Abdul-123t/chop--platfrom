import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../services/api/http';

export function usePublicQuery<T>(loader: (signal: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    loader(controller.signal)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return;
        setError(caught instanceof ApiError ? caught : new ApiError(0, 'Something went wrong. Please try again.'));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [loader, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return { data, error, loading, reload, setData };
}
