import { lazy, Suspense } from 'react';
import App from './App.tsx';
import { ADMIN_PATH, UNSUBSCRIBE_PATH } from './services/api/env';

const AdminApp = lazy(() => import('./admin/AdminApp'));
const UnsubscribePage = lazy(() => import('./pages/UnsubscribePage'));

function currentPath(): string {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

export function Root() {
  const path = currentPath();

  if (path === ADMIN_PATH || path.startsWith(`${ADMIN_PATH}/`)) {
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    );
  }

  if (path === UNSUBSCRIBE_PATH) {
    return (
      <Suspense fallback={null}>
        <UnsubscribePage />
      </Suspense>
    );
  }

  return <App />;
}
