/**
 * CHOP — Isolated Development Fixtures
 * STRICTLY FOR LOCAL DEV TESTING & AUTOMATED INTEGRATION TESTS
 * Never exposed or seeded in public production environments.
 */

import { Vendor, MenuItem, Order, VendorApplication } from '../types';

export const DEV_FIXTURES = {
  application: {
    id: 'app_test_fixture_01',
    referenceNumber: 'CHP-APP-102938',
    businessName: 'Mama Ronke Asun & Grills',
    ownerName: 'Ronke Adeyemi',
    phone: '08023456789',
    email: 'ronke.grills@example.com',
    businessCategory: 'Grill & BBQ Business',
    vendorType: 'Grill & BBQ Business',
    locationArea: 'ijebu-ode' as const,
    specificAddress: '14 Folagbade Street, Imowo Roundabout',
    landmark: 'Opposite Bovas Filling Station',
    description: 'Authentic Ijebu peppered asun, charcoal grilled fish, and seasoned suya skewers.',
    foodCategories: ['grills-asun-bbq', 'street-food-quick-bites'],
    fulfillmentOptions: 'both' as const,
    openingHours: '12:00 PM - 10:00 PM',
    status: 'approved' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } satisfies VendorApplication,

  vendor: {
    id: 'v_test_fixture_01',
    applicationId: 'app_test_fixture_01',
    referenceNumber: 'CHP-APP-102938',
    businessName: 'Mama Ronke Asun & Grills',
    slug: 'mama-ronke-asun-grills',
    vendorType: 'Grill & BBQ Business',
    description: 'Authentic Ijebu peppered asun, charcoal grilled fish, and seasoned suya skewers.',
    locationArea: 'ijebu-ode' as const,
    address: '14 Folagbade Street, Imowo Roundabout',
    landmark: 'Opposite Bovas Filling Station',
    phone: '08023456789',
    email: 'ronke.grills@example.com',
    isVerified: true,
    isActivated: true,
    isOpen: true,
    isPaused: false,
    openingHours: '12:00 PM - 10:00 PM',
    preparationMinutes: 25,
    deliveryAvailable: true,
    pickupAvailable: true,
    rating: 0,
    reviewsCount: 0,
    foodCategories: ['grills-asun-bbq', 'street-food-quick-bites'],
    commissionRate: 0.10,
    createdAt: new Date().toISOString(),
  } satisfies Vendor,

  menuItems: [
    {
      id: 'm_test_01',
      vendorId: 'v_test_fixture_01',
      name: 'Spicy Peppered Asun (Regular)',
      description: 'Slow-smoked tender goat meat tossed in habanero, onions, and local spices.',
      price: 3500,
      categorySlug: 'grills-asun-bbq',
      isAvailable: true,
      preparationMinutes: 20,
      options: [
        {
          id: 'opt_spice_01',
          name: 'Pepper Level',
          isRequired: true,
          maxSelections: 1,
          choices: [
            { id: 'c_med', name: 'Medium Pepper', priceDelta: 0 },
            { id: 'c_hot', name: 'Real Ijebu Fire', priceDelta: 0 },
          ],
        },
      ],
    },
    {
      id: 'm_test_02',
      vendorId: 'v_test_fixture_01',
      name: 'Charcoal Catfish with Fried Yam',
      description: 'Whole grilled catfish with seasoned golden dundun slices and pepper dip.',
      price: 5500,
      categorySlug: 'grills-asun-bbq',
      isAvailable: true,
      preparationMinutes: 30,
      options: [],
    },
  ] satisfies MenuItem[],
};
