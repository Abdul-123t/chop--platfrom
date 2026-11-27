import { useCallback, useEffect, useState } from 'react';
import { marketplaceApi } from './client';
import type { MarketplaceVendorDto } from './types';

const REFRESH_MS = 60_000;

export function useMarketplaceData() {
  const [vendors, setVendors] = useState<MarketplaceVendorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    marketplaceApi
      .vendors(controller.signal)
      .then((result) => {
        setVendors(result.vendors);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : 'Could not load food spots.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') reload();
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [reload]);

  return { vendors, loading, error, reload };
}
