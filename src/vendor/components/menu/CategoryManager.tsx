import { useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { fieldClass, mutedText } from '../../../components/ui/styles';
import { useAuthorizedAction } from '../../../hooks/useAuthorizedAction';
import { vendorApi } from '../../../services/api/vendor';
import type { MenuCategory } from '../../types';
import { useVendor } from '../../VendorContext';

interface CategoryManagerProps {
  categories: MenuCategory[];
  onChanged: () => void;
}

const iconButton = `p-1.5 rounded-full hover:text-[#E8772E] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed ${mutedText}`;

export function CategoryManager({ categories, onChanged }: CategoryManagerProps) {
  const { token, logout } = useVendor();
  const action = useAuthorizedAction(logout);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);

  const run = async (task: () => Promise<unknown>) => {
    const result = await action.run(task);
    if (result !== null) onChanged();
    return result !== null;
  };

  const add = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    if (await run(() => vendorApi.createCategory(token, name.trim()))) setName('');
  };

  const rename = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing || !editing.name.trim()) return;
    if (await run(() => vendorApi.updateCategory(token, editing.id, { name: editing.name.trim() }))) setEditing(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    const current = categories[index];
    const other = categories[index + direction];
    if (!current || !other) return;
    void run(() =>
      Promise.all([
        vendorApi.updateCategory(token, current.id, { position: index + direction }),
        vendorApi.updateCategory(token, other.id, { position: index }),
      ])
    );
  };

  const remove = (category: MenuCategory) => {
    if (!window.confirm(`Delete "${category.name}"? Its items stay on your menu without a category.`)) return;
    void run(() => vendorApi.deleteCategory(token, category.id));
  };

  return (
    <Card title="Categories">
      <div className="space-y-3">
        <p className={`text-[12px] ${mutedText}`}>Group your menu, for example Rice, Swallow, Proteins, Drinks.</p>
        {categories.length > 0 && (
          <ul className="space-y-1">
            {categories.map((category, index) => (
              <li key={category.id} className="flex items-center gap-1 rounded-xl px-2 py-1 bg-[#0E0D0B]/[0.03] dark:bg-white/[0.03]">
                {editing?.id === category.id ? (
                  <form onSubmit={rename} className="flex flex-1 items-center gap-1">
                    <input
                      aria-label="Category name"
                      autoFocus
                      maxLength={60}
                      value={editing.name}
                      onChange={(event) => setEditing({ id: category.id, name: event.target.value })}
                      className={`${fieldClass} py-1.5`}
                    />
                    <button type="submit" className={iconButton} aria-label="Save name">
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setEditing(null)} className={iconButton} aria-label="Cancel">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="flex-1 min-w-0 truncate text-[14px] font-semibold">{category.name}</span>
                    <button type="button" className={iconButton} disabled={index === 0 || action.pending} onClick={() => move(index, -1)} aria-label={`Move ${category.name} up`}>
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className={iconButton}
                      disabled={index === categories.length - 1 || action.pending}
                      onClick={() => move(index, 1)}
                      aria-label={`Move ${category.name} down`}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button type="button" className={iconButton} onClick={() => setEditing({ id: category.id, name: category.name })} aria-label={`Rename ${category.name}`}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button type="button" className={`${iconButton} hover:!text-[#DC2626]`} onClick={() => remove(category)} aria-label={`Delete ${category.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={add} className="flex gap-2">
          <input
            aria-label="New category name"
            placeholder="New category"
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={`${fieldClass} flex-1 min-w-0`}
          />
          <Button type="submit" variant="secondary" disabled={!name.trim()} loading={action.pending} icon={<Plus className="w-3.5 h-3.5" aria-hidden="true" />}>
            Add
          </Button>
        </form>
        {action.error && <Alert tone="error">{action.error}</Alert>}
      </div>
    </Card>
  );
}
