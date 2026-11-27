import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CartLine, StoreItem, StoreSection } from '../types';

const MAX_QUANTITY = 50;

function storageKey(slug: string): string {
  return `chop-cart-${slug}`;
}

function readCart(slug: string): CartLine[] {
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
    return Array.isArray(parsed) ? parsed.filter((line) => line.itemId && line.quantity > 0) : [];
  } catch {
    return [];
  }
}

function writeCart(slug: string, lines: CartLine[]): void {
  try {
    if (lines.length === 0) window.localStorage.removeItem(storageKey(slug));
    else window.localStorage.setItem(storageKey(slug), JSON.stringify(lines));
  } catch {
    return;
  }
}

export function useCart(slug: string) {
  const [lines, setLines] = useState<CartLine[]>(() => readCart(slug));

  useEffect(() => writeCart(slug, lines), [slug, lines]);

  const setQuantity = useCallback((item: Pick<StoreItem, 'id' | 'name' | 'price'>, quantity: number) => {
    const next = Math.max(0, Math.min(MAX_QUANTITY, quantity));
    setLines((current) => {
      const exists = current.some((line) => line.itemId === item.id);
      if (next === 0) return current.filter((line) => line.itemId !== item.id);
      if (!exists) return [...current, { itemId: item.id, name: item.name, price: item.price, quantity: next }];
      return current.map((line) => (line.itemId === item.id ? { ...line, quantity: next } : line));
    });
  }, []);

  const reconcile = useCallback((menu: StoreSection[]) => {
    const available = new Map(menu.flatMap((section) => section.items).filter((item) => item.available).map((item) => [item.id, item]));
    setLines((current) =>
      current.flatMap((line) => {
        const item = available.get(line.itemId);
        return item ? [{ ...line, name: item.name, price: item.price }] : [];
      })
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const summary = useMemo(
    () => ({
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.quantity * line.price, 0),
    }),
    [lines]
  );

  const quantityOf = useCallback((itemId: string) => lines.find((line) => line.itemId === itemId)?.quantity ?? 0, [lines]);

  return { lines, setQuantity, reconcile, clear, quantityOf, ...summary };
}
