import { useEffect } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginView } from './components/LoginView';
import { mutedText } from '../components/ui/styles';
import { useAdminSession } from './hooks/useAdminSession';

export default function AdminApp() {
  const { token, verifying, login, logout } = useAdminSession();

  useEffect(() => {
    document.title = 'CHOP Admin';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  return (
    <div className="app-shell min-h-screen overflow-x-clip bg-[#F7F1E8] dark:bg-[#0E0D0B] text-[#0E0D0B] dark:text-[#F7F1E8] text-[14px]">
      {verifying ? (
        <div className={`min-h-screen flex items-center justify-center text-[13px] ${mutedText}`}>Checking session…</div>
      ) : token ? (
        <AdminDashboard token={token} onLogout={logout} />
      ) : (
        <LoginView onLogin={login} />
      )}
    </div>
  );
}
