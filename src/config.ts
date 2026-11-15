/**
 * ============================================================================
 * CHOP CENTRAL CONFIGURATION
 * ============================================================================
 * Replace the placeholder values marked with "REPLACE_WITH_*" before launching.
 * All copy, links, waitlist numbers, form endpoint, and media slots live here.
 */
export const CHOP_CONFIG = {
  // Brand & Location
  brandName: 'CHOP',
  tagline: 'Every food spot. Every craving. One place.',
  launchCity: 'Ijebu Ode',
  launchState: 'Ogun State',
  launchAreas: ['Ijebu Ode', 'Ijagun (TASUED)'] as const,
  areaOptions: [
    'Ijebu Ode',
    'Ijagun (TASUED)',
    'Other areas near Ijebu Ode',
    'Other',
  ] as const,

  brand: {
    meaning:
      "CHOP is Nigerian slang for 'to eat'. It's the everyday word for having a meal, and that's what we're here to help you find.",
    mission:
      'Helping people in Ijebu Ode and Ijagun (TASUED) find good food around them, and giving local food businesses a chance to be seen.',
    why: "Good food is everywhere in Ijebu Ode, but finding it is not easy. It's scattered across WhatsApp statuses, Instagram posts and word of mouth. We built CHOP to bring it into one place, so people can find what's near them and small food businesses can be seen.",
  },

  // Optional logo image URL (set to null to render the CHOP display wordmark + orange mark)
  // Example: '/assets/chop-logo.png' or 'REPLACE_WITH_LOGO_URL'
  logoUrl: null as string | null,

  // Waitlist Progress & Real Count
  // IMPORTANT: Real count is shown ONLY when waitlistCount >= displayThreshold.
  // Update waitlistCount from your Google Sheet / backend before deploying.
  waitlistCount: 18,
  displayThreshold: 50,
  launchGoal: 500,

  // Contact & Social Links
  contact: {
    whatsappLink: null as string | null,
    instagramLink: null as string | null,
  },
  siteUrl: 'https://chopijebu.com',

  formEndpoint: '/api/waitlist',

  // Pricing transparency sentence injected into the FAQ
  pricingSentence:
    'Early food businesses in Ijebu Ode and Ijagun (TASUED) can apply and get listed for free during our launch phase.',

  // Image Slots (Hero food cards & product preview cover)
  images: {
    heroCards: [
      {
        id: 'jollof',
        src: '/images/hero-food.webp',
        alt: 'Smoky Nigerian party jollof rice with grilled chicken and fried plantain',
        caption: 'Bukas & Local Pots',
        tag: 'Ijebu Ode',
      },
      {
        id: 'suya',
        src: '/images/suya.webp',
        alt: 'Spiced beef suya skewers and toasted shawarma wrap with sliced onions',
        caption: 'Grills & Shawarma',
        tag: 'Evening Cravings',
      },
      {
        id: 'small-chops',
        src: '/images/small-chops.webp',
        alt: 'Platter of golden puff-puff, samosas, spring rolls, and peppered gizzard',
        caption: 'Small Chops & Pastries',
        tag: 'Events & Snacks',
      },
    ],
    productScreenshots: {
      vendorCover: '/images/vendor-cover.webp',
    },
  },
} as const;

export const FOOD_CATEGORIES = [
  {
    id: 'local-bukas',
    label: 'Local Bukas',
    shortLabel: 'Bukas',
    description: 'Amala, eba, ofada, smoky jollof, and trusted everyday pots around town.',
  },
  {
    id: 'restaurants',
    label: 'Restaurants',
    shortLabel: 'Restaurants',
    description: 'Sit-down dining rooms and family eateries across Ijebu Ode.',
  },
  {
    id: 'street-food-grills',
    label: 'Street Food & Grills',
    shortLabel: 'Grills',
    description: 'Suya spots, roasted plantain, grilled fish, and evening barbecue stands.',
  },
  {
    id: 'cafeterias-campus',
    label: 'Cafeterias & Campus',
    shortLabel: 'Campus',
    description: 'Quick, affordable meal spots serving students and busy workers.',
  },
  {
    id: 'shawarma-fast-food',
    label: 'Shawarma & Fast Food',
    shortLabel: 'Shawarma',
    description: 'Loaded wraps, meat pies, burgers, and late-night quick bites.',
  },
  {
    id: 'pizzerias',
    label: 'Pizzerias',
    shortLabel: 'Pizza',
    description: 'Freshly baked pies and box deals ready to share with friends.',
  },
  {
    id: 'bakeries',
    label: 'Bakeries',
    shortLabel: 'Bakeries',
    description: 'Warm Agege bread, cakes, pastries, and morning bakes straight from the oven.',
  },
  {
    id: 'small-chops',
    label: 'Small Chops',
    shortLabel: 'Small Chops',
    description: 'Puff-puff, samosas, spring rolls, and peppered gizzard trays.',
  },
  {
    id: 'home-kitchens',
    label: 'Home Kitchens',
    shortLabel: 'Home Kitchens',
    description: 'Independent cooks and neighbourhood kitchens with loyal followings.',
  },
  {
    id: 'online-caterers',
    label: 'Online Sellers & Caterers',
    shortLabel: 'Caterers',
    description: 'Food bowls, weekly meal preps, and celebration trays made to order.',
  },
] as const;

export const CUSTOMER_CRAVINGS = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Bakery',
  'Pizza',
  'Shawarma',
  'Small chops',
  'Drinks',
] as const;
