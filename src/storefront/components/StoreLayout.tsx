import type { ReactNode } from 'react';
import { Moon, Store, Sun } from 'lucide-react';
import { Wordmark } from '../../components/ui/Wordmark';
import { mutedText } from '../../components/ui/styles';
import { useTheme } from '../../hooks/useTheme';
import { Link } from '../../router/Link';
import { DIRECTORY_PATH, VENDOR_PATH } from '../../services/api/env';

const iconButton =
  'inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#0E0D0B]/12 dark:border-white/12 text-[#574F45] dark:text-[#A89F92] hover:text-[#E8772E] hover:border-[#E8772E] transition-colors cursor-pointer';

export function StoreLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell min-h-screen overflow-x-clip flex flex-col bg-[#F7F1E8] dark:bg-[#0E0D0B] text-[#0E0D0B] dark:text-[#F7F1E8] text-[14px]">
      <header className="sticky top-0 z-30 bg-[#F7F1E8]/90 dark:bg-[#0E0D0B]/90 backdrop-blur-xl border-b border-[#0E0D0B]/10 dark:border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/" aria-label="CHOP home">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-1.5">
            <Link
              to={DIRECTORY_PATH}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold hover:text-[#E8772E]"
            >
              <Store className="w-4 h-4" aria-hidden="true" />
              Food spots
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className={iconButton}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-3 sm:px-4 py-4">{children}</main>
      <footer className={`border-t border-[#0E0D0B]/10 dark:border-white/[0.08] py-5 text-center text-[12px] ${mutedText}`}>
        <div className="max-w-[1100px] mx-auto px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>CHOP · Food spots in Ijebu Ode</span>
          <Link to={VENDOR_PATH} className="font-semibold hover:text-[#E8772E]">
            Vendor login
          </Link>
        </div>
      </footer>
    </div>
  );
}
