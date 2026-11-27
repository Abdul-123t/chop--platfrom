import { useEffect, useMemo, useState } from 'react';
import { Search, Store } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { fieldClass, mutedText } from '../../components/ui/styles';
import { usePublicQuery } from '../../hooks/usePublicQuery';
import { Link } from '../../router/Link';
import { storefrontApi } from '../../services/api/storefront';
import { StoreLayout } from '../components/StoreLayout';
import { VendorCard } from '../components/VendorCard';

export default function VendorDirectoryPage() {
  const query = usePublicQuery(storefrontApi.vendors);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Food spots in Ijebu Ode · CHOP';
  }, []);

  const vendors = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = query.data?.vendors ?? [];
    if (!term) return list;
    return list.filter((vendor) =>
      [vendor.businessName, vendor.category, vendor.area, vendor.tagline].some((value) => value.toLowerCase().includes(term))
    );
  }, [query.data, search]);

  return (
    <StoreLayout>
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-[26px] font-extrabold tracking-tight leading-tight">Food spots near you</h1>
          <p className={`text-[14px] ${mutedText}`}>Bukas, grills, bakeries and home kitchens in Ijebu Ode and Ijagun.</p>
        </div>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedText}`} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search food spots"
            placeholder="Search amala, shawarma, cakes…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={`${fieldClass} pl-9`}
          />
        </div>

        {query.error && <Alert tone="error">{query.error.message}</Alert>}
        {!query.data && query.loading && <div className={`py-16 text-center text-[13px] ${mutedText}`}>Loading food spots…</div>}

        {query.data && vendors.length === 0 && (
          <EmptyState
            icon={Store}
            title={search ? 'No matches' : 'Vendors are joining CHOP'}
            action={
              !search && (
                <Link to="/#waitlist" className="text-[13px] font-semibold text-[#E8772E] hover:underline">
                  Join the waitlist to hear first
                </Link>
              )
            }
          >
            {search ? 'Try a different dish or area.' : 'The first food spots go live soon.'}
          </EmptyState>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.slug} vendor={vendor} />
          ))}
        </div>
      </div>
    </StoreLayout>
  );
}
