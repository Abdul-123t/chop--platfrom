import type { LocationArea, VendorApplication } from '../types';

type ApplicationInput = Omit<VendorApplication, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'updatedAt'>;

const CATEGORY_BY_TYPE: Record<string, string> = {
  Restaurant: 'Restaurants',
  'Bukka / Local Kitchen': 'Local Bukas',
  'Street-Food Seller': 'Street Food & Grills',
  'Online Food Vendor': 'Online Sellers & Caterers',
  'Independent Kitchen': 'Home Kitchens',
  'Private Chef': 'Online Sellers & Caterers',
  'Bakery & Pastries': 'Bakeries',
  'Grill & BBQ Business': 'Street Food & Grills',
  'Other Food Business': 'Home Kitchens',
};

const AREA_LABEL: Record<LocationArea, string> = {
  'ijebu-ode': 'Ijebu Ode',
  ijagun: 'Ijagun (TASUED)',
};

const FULFILMENT: Record<VendorApplication['fulfillmentOptions'], { delivers: string; options: string[] }> = {
  pickup: { delivers: 'No', options: ['Pickup'] },
  delivery: { delivers: 'Yes', options: ['Delivery'] },
  both: { delivers: 'Sometimes', options: ['Pickup', 'Delivery'] },
};

export function toWaitlistApplication(app: ApplicationInput): Record<string, unknown> {
  const category = CATEGORY_BY_TYPE[app.businessCategory] ?? 'Home Kitchens';
  const fulfilment = FULFILMENT[app.fulfillmentOptions];
  const sells = app.foodCategories.filter((value) => value !== app.businessCategory).join(', ');
  return {
    type: 'vendor',
    fullName: app.ownerName,
    whatsapp: app.phone,
    email: app.email,
    area: AREA_LABEL[app.locationArea],
    contactConsent: true,
    website: '',
    businessName: app.businessName,
    category,
    otherCategory: app.businessCategory,
    foodCategories: [category],
    delivers: fulfilment.delivers,
    fulfilmentOptions: fulfilment.options,
    operatingModel: '',
    operatingLocations: [AREA_LABEL[app.locationArea]],
    address: [app.specificAddress, app.landmark && `near ${app.landmark}`].filter(Boolean).join(', ').slice(0, 500),
    businessDescription: [app.description, sells && `Sells: ${sells}`].filter(Boolean).join('\n').slice(0, 2000),
    socialMediaLink: '',
    additionalComments: app.openingHours ? `Opening hours: ${app.openingHours}` : '',
  };
}
