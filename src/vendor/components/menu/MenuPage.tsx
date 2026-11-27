import { useEffect, useMemo, useState } from 'react';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { mutedText } from '../../../components/ui/styles';
import { useAuthorizedAction } from '../../../hooks/useAuthorizedAction';
import { useTokenQuery } from '../../../hooks/useTokenQuery';
import { vendorApi } from '../../../services/api/vendor';
import type { MenuItem, VendorMenu } from '../../types';
import { useVendor } from '../../VendorContext';
import { PageHeader } from '../PageHeader';
import { CategoryManager } from './CategoryManager';
import { MenuItemEditor, type EditorTarget } from './MenuItemEditor';
import { MenuSectionList } from './MenuSectionList';

export interface MenuGroup {
  id: string | null;
  name: string;
  items: MenuItem[];
}

function groupItems(menu: VendorMenu): MenuGroup[] {
  const known = new Set(menu.categories.map((category) => category.id));
  const groups: MenuGroup[] = menu.categories.map((category) => ({
    id: category.id,
    name: category.name,
    items: menu.items.filter((item) => item.categoryId === category.id),
  }));
  const loose = menu.items.filter((item) => !item.categoryId || !known.has(item.categoryId));
  if (loose.length > 0 || groups.length === 0) groups.push({ id: null, name: 'No category', items: loose });
  return groups;
}

export function MenuPage() {
  const { token, logout, menuVersion, reloadOverview } = useVendor();
  const query = useTokenQuery(token, vendorApi.menu, logout);
  const action = useAuthorizedAction(logout);
  const [editor, setEditor] = useState<EditorTarget | null>(null);
  const { reload, setData } = query;

  useEffect(() => {
    if (menuVersion > 0) reload();
  }, [menuVersion, reload]);

  const menu = query.data?.menu;
  const groups = useMemo(() => (menu ? groupItems(menu) : []), [menu]);

  const updateMenu = (update: (current: VendorMenu) => VendorMenu) =>
    setData((current) => (current ? { menu: update(current.menu) } : current));

  const toggleAvailable = async (item: MenuItem, available: boolean) => {
    updateMenu((current) => ({
      ...current,
      items: current.items.map((entry) => (entry.id === item.id ? { ...entry, available } : entry)),
    }));
    const result = await action.run(() => vendorApi.updateItem(token, item.id, { available }));
    if (!result) reload();
    reloadOverview();
  };

  const handleSaved = () => {
    setEditor(null);
    reload();
    reloadOverview();
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Menu"
        subtitle={menu ? `${menu.items.length} items · ${menu.items.filter((item) => item.available).length} available` : undefined}
        actions={
          <Button icon={<Plus className="w-3.5 h-3.5" aria-hidden="true" />} onClick={() => setEditor({ mode: 'create', categoryId: null })}>
            Add item
          </Button>
        }
      />

      {action.error && <Alert tone="error">{action.error}</Alert>}
      {query.error && <Alert tone="error">{query.error}</Alert>}
      {!menu && query.loading && <div className={`py-10 text-center text-[13px] ${mutedText}`}>Loading menu…</div>}

      {menu && (
        <>
          <CategoryManager categories={menu.categories} onChanged={() => reload()} />
          {menu.items.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="Add your first dish"
              action={
                <Button icon={<Plus className="w-3.5 h-3.5" aria-hidden="true" />} onClick={() => setEditor({ mode: 'create', categoryId: null })}>
                  Add item
                </Button>
              }
            >
              Customers see your menu with prices on your CHOP page. Add photos to make dishes stand out.
            </EmptyState>
          ) : (
            <MenuSectionList
              groups={groups}
              onAdd={(categoryId) => setEditor({ mode: 'create', categoryId })}
              onEdit={(item) => setEditor({ mode: 'edit', item })}
              onToggle={(item, available) => void toggleAvailable(item, available)}
            />
          )}
        </>
      )}

      {editor && menu && (
        <MenuItemEditor target={editor} categories={menu.categories} onClose={() => setEditor(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}
