import type { LocationArea, MenuItem, Vendor } from '../types';

export interface VendorFilter {
  area: LocationArea;
  query: string;
  category: string | null;
}

function normalize(value: string): string {
  return value.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').trim();
}

export function isListed(vendor: Vendor): boolean {
  return vendor.isVerified && vendor.isActivated;
}

export function matchesQuery(vendor: Vendor, items: MenuItem[], query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalize(
    [vendor.businessName, vendor.description, vendor.vendorType ?? '', ...items.map((item) => `${item.name} ${item.description}`)].join(' ')
  );
  return terms.every((term) => haystack.includes(term));
}

export function matchesCategory(vendor: Vendor, items: MenuItem[], category: string | null): boolean {
  if (!category) return true;
  return Boolean(vendor.foodCategories?.includes(category)) || items.some((item) => item.categorySlug === category);
}

export function filterVendors(vendors: Vendor[], menuItems: MenuItem[], filter: VendorFilter): Vendor[] {
  return vendors.filter((vendor) => {
    if (!isListed(vendor) || vendor.locationArea !== filter.area) return false;
    const items = menuItems.filter((item) => item.vendorId === vendor.id);
    return matchesQuery(vendor, items, filter.query) && matchesCategory(vendor, items, filter.category);
  });
}
