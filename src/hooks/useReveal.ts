import { useEffect, useRef, useState } from 'react';

interface ObserverSubscription {
  callback: () => void;
  once: boolean;
}

const revealCallbacks = new Map<Element, Set<ObserverSubscription>>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver() {
  if (!sharedObserver && 'IntersectionObserver' in window) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const subscriptions = revealCallbacks.get(entry.target);
          if (!subscriptions) continue;

          for (const subscription of subscriptions) {
            subscription.callback();
            if (subscription.once) subscriptions.delete(subscription);
          }

          if (subscriptions.size === 0) {
            revealCallbacks.delete(entry.target);
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
    );
  }

  return sharedObserver;
}

export function observeRevealTarget(
  node: Element,
  callback: () => void,
  once = true
) {
  const observer = getSharedObserver();
  if (!observer) {
    if (once) callback();
    return () => {};
  }

  const subscription: ObserverSubscription = { callback, once };
  const subscriptions = revealCallbacks.get(node) ?? new Set<ObserverSubscription>();
  subscriptions.add(subscription);
  revealCallbacks.set(node, subscriptions);
  observer.observe(node);

  return () => {
    subscriptions.delete(subscription);
    if (subscriptions.size === 0) {
      revealCallbacks.delete(node);
      observer.unobserve(node);
    }
  };
}

export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node) return;

    return observeRevealTarget(node, () => setIsVisible(true));
  }, [isVisible]);

  return { ref, isVisible };
}
