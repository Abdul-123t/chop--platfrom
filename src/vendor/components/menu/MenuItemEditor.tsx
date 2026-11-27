import { useState, type FormEvent } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Field } from '../../../components/ui/Field';
import { Sheet } from '../../../components/ui/Sheet';
import { Toggle } from '../../../components/ui/Toggle';
import { fieldClass, mutedText } from '../../../components/ui/styles';
import { useAuthorizedAction } from '../../../hooks/useAuthorizedAction';
import { vendorApi } from '../../../services/api/vendor';
import { parseNaira } from '../../../utils/money';
import type { MenuCategory, MenuItem, MenuItemInput } from '../../types';
import { useVendor } from '../../VendorContext';
import { ImagePicker } from '../shared/ImagePicker';

export type EditorTarget = { mode: 'create'; categoryId: string | null } | { mode: 'edit'; item: MenuItem };

interface MenuItemEditorProps {
  target: EditorTarget;
  categories: MenuCategory[];
  onClose: () => void;
  onSaved: () => void;
}

function initialDraft(target: EditorTarget): MenuItemInput {
  if (target.mode === 'edit') {
    const { item } = target;
    return {
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      available: item.available,
      imageUrl: item.imageUrl || null,
    };
  }
  return { name: '', description: '', price: 0, categoryId: target.categoryId, available: true, imageUrl: null };
}

export function MenuItemEditor({ target, categories, onClose, onSaved }: MenuItemEditorProps) {
  const { token, logout } = useVendor();
  const action = useAuthorizedAction(logout);
  const [draft, setDraft] = useState<MenuItemInput>(() => initialDraft(target));
  const [priceText, setPriceText] = useState(() => (draft.price ? String(draft.price) : ''));
  const editing = target.mode === 'edit' ? target.item : null;
  const valid = draft.name.trim().length > 0 && priceText.trim() !== '';

  const update = (patch: Partial<MenuItemInput>) => setDraft((current) => ({ ...current, ...patch }));

  const upload = async (file: Blob) => {
    const result = await action.run(() => vendorApi.upload(token, 'item', file));
    if (!result) return false;
    update({ imageUrl: result.url });
    return true;
  };

  const save = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!valid) return;
    const payload = { ...draft, name: draft.name.trim(), description: draft.description.trim(), price: parseNaira(priceText) };
    const result = await action.run(() =>
      editing ? vendorApi.updateItem(token, editing.id, payload) : vendorApi.createItem(token, payload)
    );
    if (result) onSaved();
  };

  const remove = async () => {
    if (!editing || !window.confirm(`Delete ${editing.name} from your menu?`)) return;
    const result = await action.run(() => vendorApi.deleteItem(token, editing.id));
    if (result) onSaved();
  };

  return (
    <Sheet
      title={editing ? 'Edit item' : 'Add menu item'}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-2">
          {editing ? (
            <Button
              variant="ghost"
              disabled={action.pending}
              onClick={() => void remove()}
              icon={<Trash2 className="w-3.5 h-3.5" aria-hidden="true" />}
              className="hover:!text-[#DC2626] px-0"
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <Button
            loading={action.pending}
            disabled={!valid}
            onClick={() => void save()}
            icon={<Save className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            {editing ? 'Save changes' : 'Add to menu'}
          </Button>
        </div>
      }
    >
      <form onSubmit={save} className="space-y-4">
        <Field label="Name" htmlFor="item-name">
          <input
            id="item-name"
            autoFocus={!editing}
            maxLength={80}
            value={draft.name}
            onChange={(event) => update({ name: event.target.value })}
            placeholder="Jollof rice and chicken"
            className={fieldClass}
          />
        </Field>
        <Field label="Price" htmlFor="item-price" hint="Whole naira, no kobo.">
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold ${mutedText}`}>₦</span>
            <input
              id="item-price"
              inputMode="numeric"
              value={priceText}
              onChange={(event) => setPriceText(event.target.value.replace(/[^\d]/g, ''))}
              placeholder="2500"
              className={`${fieldClass} pl-7 tabular-nums`}
            />
          </div>
        </Field>
        <Field label="Description" htmlFor="item-description" hint="Optional. Portion size, what comes with it.">
          <textarea
            id="item-description"
            rows={3}
            maxLength={300}
            value={draft.description}
            onChange={(event) => update({ description: event.target.value })}
            className={`${fieldClass} resize-y`}
          />
        </Field>
        <Field label="Category" htmlFor="item-category">
          <select
            id="item-category"
            value={draft.categoryId ?? ''}
            onChange={(event) => update({ categoryId: event.target.value || null })}
            className={fieldClass}
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Toggle
          label="Available"
          description="Turn off when it is sold out. Customers will see it as unavailable."
          checked={draft.available}
          onChange={(available) => update({ available })}
        />
        <ImagePicker
          label="Photo"
          shape="square"
          maxSide={1200}
          value={draft.imageUrl ?? ''}
          hint="Optional. A clear photo of the dish."
          onUpload={upload}
          onRemove={() => update({ imageUrl: null })}
        />
        {action.error && <Alert tone="error">{action.error}</Alert>}
        <button type="submit" className="hidden" />
      </form>
    </Sheet>
  );
}
