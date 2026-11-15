import { ReactNode, Suspense, useEffect, useRef, useState } from 'react';

type ReservedHeights = [number, number, number, number, number];

interface DeferredSectionProps {
  id: string;
  tone: 'cream' | 'sand' | 'preview' | 'vendors' | 'orange' | 'counter' | 'footer';
  reservedHeights: ReservedHeights;
  children: ReactNode;
}

const pendingSections = new Map<Element, () => void>();
let sectionObserver: IntersectionObserver | null = null;

function observeNearViewport(node: Element, callback: () => void) {
  if (!('IntersectionObserver' in window)) {
    callback();
    return () => {};
  }

  if (!sectionObserver) {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          sectionObserver?.unobserve(entry.target);
          const loadSection = pendingSections.get(entry.target);
          pendingSections.delete(entry.target);
          loadSection?.();
        }
      },
      { rootMargin: '200px' }
    );
  }

  pendingSections.set(node, callback);
  sectionObserver.observe(node);

  return () => {
    pendingSections.delete(node);
    sectionObserver?.unobserve(node);
  };
}

export function DeferredSection({
  id,
  tone,
  reservedHeights,
  children,
}: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeNearViewport(node, () => setShouldLoad(true));
  }, []);

  const [small, mobile, tablet, desktop, wide] = reservedHeights;

  return (
    <div
      ref={ref}
      id={id}
      data-deferred-slot={tone}
      className="deferred-section-slot"
      style={
        {
          '--slot-small': `${small}px`,
          '--slot-mobile': `${mobile}px`,
          '--slot-tablet': `${tablet}px`,
          '--slot-desktop': `${desktop}px`,
          '--slot-wide': `${wide}px`,
          scrollMarginTop: '92px',
        } as React.CSSProperties
      }
    >
      {shouldLoad ? (
        <Suspense fallback={<div aria-hidden="true" className="deferred-section-fallback" />}>
          {children}
        </Suspense>
      ) : (
        <div aria-hidden="true" className="deferred-section-fallback" />
      )}
    </div>
  );
}
