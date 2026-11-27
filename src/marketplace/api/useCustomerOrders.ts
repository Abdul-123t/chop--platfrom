import { useCallback, useEffect, useMemo, useState } from 'react';
import { recentOrders, rememberOrder } from '../../storefront/utils/recentOrders';
import type { LocationArea, Order } from '../types';
import { marketplaceApi } from './client';
import { isActiveOrder, toOrder } from './mappers';
import type { OrderDto } from './types';

const ACTIVE_REFRESH_MS = 15_000;

function merge(primary: OrderDto[], extra: OrderDto[]): OrderDto[] {
  const seen = new Set(primary.map((order) => order.id));
  return [...primary, ...extra.filter((order) => !seen.has(order.id))].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function loadGuestOrders(): Promise<OrderDto[]> {
  const results = await Promise.allSettled(recentOrders().map((orderId) => marketplaceApi.order(orderId)));
  return results.flatMap((result) => (result.status === 'fulfilled' ? [result.value.order] : []));
}

export function useCustomerOrders(token: string | null, area: LocationArea) {
  const [dtos, setDtos] = useState<OrderDto[]>([]);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [mine, guest] = await Promise.all([
        token ? marketplaceApi.customerOrders(token).then((result) => result.orders).catch(() => []) : Promise.resolve([]),
        loadGuestOrders(),
      ]);
      if (!cancelled) setDtos(merge(mine, guest));
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [token, version]);

  const orders: Order[] = useMemo(() => dtos.map((dto) => toOrder(dto, area)), [dtos, area]);
  const hasActive = orders.some(isActiveOrder);

  useEffect(() => {
    if (!hasActive) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') reload();
    }, ACTIVE_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [hasActive, reload]);

  const addPlaced = useCallback((dto: OrderDto) => {
    rememberOrder(dto.id);
    setDtos((current) => merge([dto], current));
  }, []);

  const cancel = useCallback(async (orderId: string) => {
    const result = await marketplaceApi.cancelOrder(orderId);
    setDtos((current) => current.map((entry) => (entry.id === orderId ? { ...entry, ...result.order } : entry)));
  }, []);

  return { orders, addPlaced, reload, cancel };
}
