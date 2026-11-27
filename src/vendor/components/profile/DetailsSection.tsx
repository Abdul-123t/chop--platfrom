import { useState, type FormEvent } from 'react';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { fieldClass } from '../../../components/ui/styles';
import { useProfileSaver } from '../../hooks/useProfileSaver';
import type { VendorProfile } from '../../types';
import { SaveRow } from './SaveRow';

interface DetailsDraft {
  businessName: string;
  tagline: string;
  category: string;
  description: string;
  area: string;
  address: string;
  locations: string;
  socialLink: string;
  email: string;
}

function toDraft(vendor: VendorProfile): DetailsDraft {
  return {
    businessName: vendor.businessName,
    tagline: vendor.tagline,
    category: vendor.category,
    description: vendor.description,
    area: vendor.area,
    address: vendor.address,
    locations: vendor.locations.join(', '),
    socialLink: vendor.socialLink,
    email: vendor.email,
  };
}

export function DetailsSection({ vendor }: { vendor: VendorProfile }) {
  const { save, pending, error, savedAt } = useProfileSaver();
  const [draft, setDraft] = useState<DetailsDraft>(() => toDraft(vendor));
  const [baseline, setBaseline] = useState(() => JSON.stringify(toDraft(vendor)));
  const dirty = JSON.stringify(draft) !== baseline;

  const update = (patch: Partial<DetailsDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const saved = await save({
      businessName: draft.businessName.trim(),
      tagline: draft.tagline.trim(),
      category: draft.category.trim(),
      description: draft.description.trim(),
      area: draft.area.trim(),
      address: draft.address.trim(),
      locations: draft.locations
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      socialLink: draft.socialLink.trim(),
      email: draft.email.trim(),
    });
    if (saved) setBaseline(JSON.stringify(draft));
  };

  const input = (key: keyof DetailsDraft, props: { placeholder?: string; maxLength: number; type?: string }) => (
    <input
      id={`details-${key}`}
      value={draft[key]}
      onChange={(event) => update({ [key]: event.target.value })}
      className={fieldClass}
      {...props}
    />
  );

  return (
    <Card title="Business details">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Business name" htmlFor="details-businessName">
          {input('businessName', { maxLength: 80 })}
        </Field>
        <Field label="Tagline" htmlFor="details-tagline" hint="One short line, e.g. Hot amala every day since 2015.">
          {input('tagline', { maxLength: 100 })}
        </Field>
        <Field label="Food type" htmlFor="details-category">
          {input('category', { maxLength: 60, placeholder: 'Local dishes' })}
        </Field>
        <Field label="About" htmlFor="details-description">
          <textarea
            id="details-description"
            rows={4}
            maxLength={600}
            value={draft.description}
            onChange={(event) => update({ description: event.target.value })}
            className={`${fieldClass} resize-y`}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Area" htmlFor="details-area">
            {input('area', { maxLength: 60, placeholder: 'Ijebu Ode' })}
          </Field>
          <Field label="Email" htmlFor="details-email" hint="For order alerts and password resets.">
            {input('email', { maxLength: 254, type: 'email', placeholder: 'you@example.com' })}
          </Field>
        </div>
        <Field label="Address" htmlFor="details-address" hint="Shown to customers who choose pickup.">
          {input('address', { maxLength: 200 })}
        </Field>
        <Field label="Areas you serve" htmlFor="details-locations" hint="Separate with commas.">
          {input('locations', { maxLength: 400, placeholder: 'Ijebu Ode, Ijagun' })}
        </Field>
        <Field label="Instagram or social link" htmlFor="details-socialLink">
          {input('socialLink', { maxLength: 300, type: 'url', placeholder: 'https://instagram.com/yourstore' })}
        </Field>
        <SaveRow dirty={dirty} pending={pending} error={error} saved={savedAt !== null} />
      </form>
    </Card>
  );
}
