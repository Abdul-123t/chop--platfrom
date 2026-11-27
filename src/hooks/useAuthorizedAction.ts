import { useCallback, useState } from 'react';
import { ApiError } from '../services/api/http';

export function useAuthorizedAction(onUnauthorized: () => void) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T | null> => {
      setPending(true);
      setError(null);
      try {
        return await action();
      } catch (caught) {
        if (caught instanceof ApiError && caught.status === 401) {
          onUnauthorized();
          return null;
        }
        setError(caught instanceof Error ? caught.message : 'Something went wrong.');
        return null;
      } finally {
        setPending(false);
      }
    },
    [onUnauthorized]
  );

  return { run, pending, error, clearError: () => setError(null) };
}
