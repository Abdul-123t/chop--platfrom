import { lazy, Suspense, type ReactNode } from 'react';
import { matchPath, useLocation } from './router/navigation';
import { ADMIN_PATH, DIRECTORY_PATH, UNSUBSCRIBE_PATH, VENDOR_PATH, WAITLIST_PATH } from './services/api/env';

const MarketplaceRoot = lazy(() => import('./marketplace/MarketplaceRoot'));
const WaitlistSite = lazy(() => import('./App'));
const AdminApp = lazy(() => import('./admin/AdminApp'));
const VendorApp = lazy(() => import('./vendor/VendorApp'));
const UnsubscribePage = lazy(() => import('./pages/UnsubscribePage'));
const VendorDirectoryPage = lazy(() => import('./storefront/pages/VendorDirectoryPage'));
const VendorStorePage = lazy(() => import('./storefront/pages/VendorStorePage'));
const OrderTrackingPage = lazy(() => import('./storefront/pages/OrderTrackingPage'));

function within(path: string, base: string): boolean {
  return path === base || path.startsWith(`${base}/`);
}

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export function Root() {
  const { path } = useLocation();

  if (within(path, ADMIN_PATH)) {
    return (
      <Lazy>
        <AdminApp />
      </Lazy>
    );
  }

  if (within(path, VENDOR_PATH)) {
    return (
      <Lazy>
        <VendorApp />
      </Lazy>
    );
  }

  if (path === UNSUBSCRIBE_PATH) {
    return (
      <Lazy>
        <UnsubscribePage />
      </Lazy>
    );
  }

  if (path === WAITLIST_PATH) {
    return (
      <Lazy>
        <WaitlistSite />
      </Lazy>
    );
  }

  if (path === DIRECTORY_PATH) {
    return (
      <Lazy>
        <VendorDirectoryPage />
      </Lazy>
    );
  }

  const store = matchPath('/v/:slug', path);
  if (store?.slug) {
    return (
      <Lazy>
        <VendorStorePage key={store.slug} slug={store.slug} />
      </Lazy>
    );
  }

  const order = matchPath('/order/:id', path);
  if (order?.id) {
    return (
      <Lazy>
        <OrderTrackingPage key={order.id} orderId={order.id} />
      </Lazy>
    );
  }

  return (
    <Lazy>
      <MarketplaceRoot />
    </Lazy>
  );
}
