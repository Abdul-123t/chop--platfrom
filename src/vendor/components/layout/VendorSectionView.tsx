import type { VendorSection } from '../../types';
import { MenuPage } from '../menu/MenuPage';
import { OrdersPage } from '../orders/OrdersPage';
import { OverviewPage } from '../overview/OverviewPage';
import { ProfilePage } from '../profile/ProfilePage';
import { SettingsPage } from '../settings/SettingsPage';

export function VendorSectionView({ section }: { section: VendorSection }) {
  switch (section) {
    case 'orders':
      return <OrdersPage />;
    case 'menu':
      return <MenuPage />;
    case 'profile':
      return <ProfilePage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <OverviewPage />;
  }
}
