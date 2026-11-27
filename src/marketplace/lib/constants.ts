import { FoodCategory, LocationArea } from '../types';

export const BRAND = {
  name: 'CHOP',
  tagline: 'Good food, closer to you.',
  welcomeTitle: 'Welcome to CHOP.',
  motto: 'Rooted in Ijebu. Built around you.',
  footerDescription: 'Discover the food, kitchens and flavours that make Ijebu special.',
  accentColor: '#C45B3A',
  inkColor: '#141414',
  warmBg: '#F7F6F2',
};

export interface ServiceLocationInfo {
  id: LocationArea;
  name: string;
  badge: string;
  description: string;
  deliveryBaseFee: number; // In Naira ₦
  hubHighlights: string[];
}

export const SERVICE_LOCATIONS: Record<LocationArea, ServiceLocationInfo> = {
  'ijebu-ode': {
    id: 'ijebu-ode',
    name: 'Ijebu Ode',
    badge: 'General Service Area',
    description: 'Serving residences, businesses, and communities across Ijebu Ode.',
    deliveryBaseFee: 600,
    hubHighlights: ['Ijebu Ode General Service Area'],
  },
  'ijagun': {
    id: 'ijagun',
    name: 'Ijagun',
    badge: 'TASUED & Surrounding Area',
    description: 'Serving students, staff, hostels, and communities across Ijagun.',
    deliveryBaseFee: 450,
    hubHighlights: ['Ijagun & TASUED Communities'],
  },
};

// 11 Comprehensive Food Categories for CHOP
export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'cat-local-ijebu',
    name: 'Local & Ijebu Favourites',
    slug: 'local-ijebu-favourites',
    tagline: 'Ikoyi jollof, ofada, dundun and traditional culinary pride',
    iconName: 'UtensilsCrossed',
    popularItems: ['Ikoyi Jollof', 'Ofada Rice & Ayamase', 'Ewa Aganyin', 'Yam Porridge (Asaro)'],
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-rice-one-pot',
    name: 'Rice & One-Pot Meals',
    slug: 'rice-one-pot',
    tagline: 'Smoky party jollof, fried rice, coconut rice and native jollof',
    iconName: 'Flame',
    popularItems: ['Smoky Firewood Jollof', 'Special Fried Rice', 'Native Concoction Rice', 'Stir-fry Pasta'],
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-swallow-soups',
    name: 'Swallow & Soups',
    slug: 'swallow-soups',
    tagline: 'Amala, pounded yam, semo, eba with rich egusi, ewedu and efo riro',
    iconName: 'Soup',
    popularItems: ['Amala with Gbegiri & Ewedu', 'Pounded Yam & Egusi', 'Eba with Efo Riro', 'Fufu & Bitterleaf'],
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-grills-asun',
    name: 'Grills, Asun & BBQ',
    slug: 'grills-asun-bbq',
    tagline: 'Smoked goat meat, peppered wings, charcoal grilled fish and suya',
    iconName: 'FlameKindling',
    popularItems: ['Spicy Peppered Asun', 'Charcoal Catfish', 'Beef Suya Skewers', 'Peppered Turkey'],
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-street-food',
    name: 'Street Food & Quick Bites',
    slug: 'street-food-quick-bites',
    tagline: 'Hot akara, roasted boli & groundnut, fried yam and street dundun',
    iconName: 'Sparkles',
    popularItems: ['Roasted Boli & Groundnut', 'Hot Akara Balls', 'Fried Yam & Pepper Sauce', 'Puff Puff Cup'],
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'cat-shawarma-fast',
    name: 'Shawarma, Burgers & Fast Food',
    slug: 'shawarma-burgers-fast-food',
    tagline: 'Loaded double-sausage shawarma, crispy fries and juicy burgers',
    iconName: 'Sandwich',
    popularItems: ['Double Sausage Shawarma', 'Crispy Chicken & Chips', 'Beef Burger Special', 'Club Sandwich'],
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'cat-breakfast-brunch',
    name: 'Breakfast & Brunch',
    slug: 'breakfast-brunch',
    tagline: 'Ogi & akara, fresh bread with egg, pancakes and morning bites',
    iconName: 'Coffee',
    popularItems: ['Hot Ogi & Akara', 'Fresh Bread with Fried Eggs', 'Pancakes & Syrup', 'Custard Bowl'],
    displayOrder: 7,
    isActive: true,
  },
  {
    id: 'cat-snacks-bakery',
    name: 'Snacks & Bakery',
    slug: 'snacks-bakery',
    tagline: 'Flaky meat pies, fresh pastries, golden doughnuts and sausage rolls',
    iconName: 'Cookie',
    popularItems: ['Flaky Beef Meat Pie', 'Soft Glazed Doughnuts', 'Sausage Roll', 'Scotch Egg'],
    displayOrder: 8,
    isActive: true,
  },
  {
    id: 'cat-drinks-refreshments',
    name: 'Drinks & Refreshments',
    slug: 'drinks-refreshments',
    tagline: 'Spiced zobo, freshly squeezed juices, tiger nut milk and chilled sodas',
    iconName: 'GlassWater',
    popularItems: ['Spiced Zobo Infusion', 'Creamy Kunu Aya', 'Fresh Fruit Parfait', 'Chilled Citrus Blend'],
    displayOrder: 9,
    isActive: true,
  },
  {
    id: 'cat-family-sharing',
    name: 'Family & Sharing Meals',
    slug: 'family-sharing-meals',
    tagline: 'Party bowls, sharing platters and bulk Sunday lunch packages',
    iconName: 'Users',
    popularItems: ['Jollof Sharing Cooler', 'Weekend Asun Platter', 'Soup Pot Special (2L)', 'Small Chops Box'],
    displayOrder: 10,
    isActive: true,
  },
  {
    id: 'cat-healthy-special',
    name: 'Healthy & Special Meals',
    slug: 'healthy-special-meals',
    tagline: 'Fruit salads, low-oil soups, boiled plantain and diet-conscious bowls',
    iconName: 'Salad',
    popularItems: ['Fresh Fruit Bowl', 'Boiled Plantain & Veg Fish Sauce', 'Oat Meal & Honey', 'Detox Green Blend'],
    displayOrder: 11,
    isActive: true,
  },
];

// Editorial Food Stories celebrating Nigerian and Ijebu food culture (Purely educational & inspirational)
export const EDITORIAL_STORIES: import('../types').EditorialFoodStory[] = [
  {
    id: 'story-01',
    number: '01',
    title: 'Smoky Party Jollof & Asun',
    editorialCategory: 'THE PARTY TABLE',
    description:
      'An irresistible combination of smoky Nigerian party jollof and spicy, fire-grilled goat meat. A celebration favourite inspired by the flavours of Nigerian gatherings.',
    imageUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Authentic Nigerian smoky party jollof rice paired with spicy grilled peppered asun goat meat',
    culturalNote: 'Celebration Classic',
  },
  {
    id: 'story-02',
    number: '02',
    title: 'Pounded Yam & Egusi',
    editorialCategory: 'THE COMFORT CLASSIC',
    description:
      'Smooth, freshly prepared swallow paired with richly seasoned egusi soup, assorted meat and traditional ingredients.',
    imageUrl:
      'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Traditional Nigerian pounded yam swallow with richly spiced egusi soup and tender meats',
    culturalNote: 'Comfort Heritage',
  },
  {
    id: 'story-03',
    number: '03',
    title: 'Double Sausage Shawarma',
    editorialCategory: 'STREET FOOD CULTURE',
    description:
      'A satisfying street-food favourite inspired by grilled chicken, sausages, toasted flatbread and a rich spicy dressing.',
    imageUrl:
      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Toasted double sausage shawarma roll with spicy seasoned fillings and creamy dressing',
    culturalNote: 'Street Food Energy',
  },
  {
    id: 'story-04',
    number: '04',
    title: 'Charcoal Grilled Fish & Yam',
    editorialCategory: 'THE EVENING GRILL',
    description:
      'Tender grilled fish seasoned with bold pepper flavours, paired with golden fried yam. An experience inspired by Nigeria\'s evening grill culture.',
    imageUrl:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Charcoal-grilled spiced fish garnished with hot pepper sauce and golden fried yam slices',
    culturalNote: 'Night Grill Favourite',
  },
];

// Vendor Types supported across Ijebu Ode & Ijagun
export const VENDOR_TYPES = [
  { id: 'restaurant', name: 'Restaurant', description: 'Established sit-down & takeout dining venues' },
  { id: 'bukka', name: 'Bukka / Local Kitchen', description: 'Traditional Yoruba bukka & local delicacy experts' },
  { id: 'street-food', name: 'Street-Food Seller', description: 'Freshly prepared evening grills, boli, akara & fast fries' },
  { id: 'online-vendor', name: 'Online Food Vendor', description: 'Delivery-first kitchen brands & pre-order lunch chefs' },
  { id: 'independent-kitchen', name: 'Independent Kitchen', description: 'Home-based certified cooks & specialty kitchens' },
  { id: 'private-chef', name: 'Private Chef', description: 'Catering specialists & customized personal culinary services' },
  { id: 'bakery', name: 'Bakery & Pastries', description: 'Fresh loaves, pastries, cakes & afternoon confectionery' },
  { id: 'grill-business', name: 'Grill & BBQ Business', description: 'Asun, fish barbeque, suya and night meat grills' },
  { id: 'other', name: 'Other Food Business', description: 'Juice bars, beverage hubs and specialty food suppliers' },
] as const;

export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};
