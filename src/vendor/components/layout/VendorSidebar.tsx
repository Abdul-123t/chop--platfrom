import { NavItemBadge, type DrawerNavItem } from '../../../components/ui/NavDrawer';
import { SignOutButton } from '../../../components/ui/SignOutButton';
import type { VendorSection } from '../../types';

interface VendorSidebarProps {
  items: DrawerNavItem<VendorSection>[];
  active: VendorSection;
  onSelect: (section: VendorSection) => void;
  onSignOut: () => void;
}

export function VendorSidebar({ items, active, onSelect, onSignOut }: VendorSidebarProps) {
  return (
    <aside className="hidden md:block">
      <nav aria-label="Store sections" className="sticky top-[72px] space-y-1">
        {items.map(({ value, label, icon: Icon, badge }) => {
          const selected = value === active;
          return (
            <button
              key={value}
              type="button"
              aria-current={selected ? 'page' : undefined}
              onClick={() => onSelect(value)}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] font-semibold transition-colors cursor-pointer ${
                selected
                  ? 'bg-[#E8772E] text-[#0E0D0B]'
                  : 'text-[#574F45] dark:text-[#A89F92] hover:bg-[#0E0D0B]/[0.05] dark:hover:bg-white/[0.05] hover:text-[#0E0D0B] dark:hover:text-[#F7F1E8]'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
              <NavItemBadge count={badge} />
            </button>
          );
        })}
        <div className="pt-3 mt-3 border-t border-[#0E0D0B]/10 dark:border-white/[0.08]">
          <SignOutButton onClick={onSignOut} />
        </div>
      </nav>
    </aside>
  );
}
