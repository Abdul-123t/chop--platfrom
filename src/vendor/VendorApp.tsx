import { useEffect } from 'react';
import '../index.css';
import { mutedText } from '../components/ui/styles';
import { useTheme } from '../hooks/useTheme';
import { useLocation } from '../router/navigation';
import { VENDOR_PATH } from '../services/api/env';
import { VendorForgotView } from './components/auth/VendorForgotView';
import { VendorLoginView } from './components/auth/VendorLoginView';
import { VendorSetupView } from './components/auth/VendorSetupView';
import { VendorPortal } from './components/layout/VendorPortal';
import { useVendorSession } from './hooks/useVendorSession';
import { sectionFromPath } from './navigation';

export default function VendorApp() {
  useTheme();
  const { path, query } = useLocation();
  const { session, verifying, login, start, logout } = useVendorSession();
  const subPath = path.slice(VENDOR_PATH.length);

  useEffect(() => {
    document.title = 'CHOP for Vendors';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  const content = (() => {
    if (subPath === '/setup' || subPath === '/reset') {
      return <VendorSetupView token={query.get('token') ?? ''} onComplete={start} />;
    }
    if (subPath === '/forgot') return <VendorForgotView />;
    if (verifying) {
      return <div className={`min-h-screen flex items-center justify-center text-[13px] ${mutedText}`}>Checking session…</div>;
    }
    if (!session) return <VendorLoginView onLogin={login} />;
    return <VendorPortal session={session} section={sectionFromPath(subPath)} onLogout={logout} onSessionReplace={start} />;
  })();

  return (
    <div className="app-shell min-h-screen overflow-x-clip bg-[#F7F1E8] dark:bg-[#0E0D0B] text-[#0E0D0B] dark:text-[#F7F1E8] text-[14px]">
      {content}
    </div>
  );
}
