export const FOOD_TYPES = [
  { slug: 'local-ijebu-favourites', label: 'Local & Ijebu Favourites' },
  { slug: 'rice-one-pot', label: 'Rice & One-Pot Meals' },
  { slug: 'swallow-soups', label: 'Swallow & Soups' },
  { slug: 'grills-asun-bbq', label: 'Grills, Asun & BBQ' },
  { slug: 'street-food-quick-bites', label: 'Street Food & Quick Bites' },
  { slug: 'shawarma-burgers-fast-food', label: 'Shawarma, Burgers & Fast Food' },
  { slug: 'breakfast-brunch', label: 'Breakfast & Brunch' },
  { slug: 'snacks-bakery', label: 'Snacks & Bakery' },
  { slug: 'drinks-refreshments', label: 'Drinks & Refreshments' },
  { slug: 'family-sharing-meals', label: 'Family & Sharing Meals' },
  { slug: 'healthy-special-meals', label: 'Healthy & Special Meals' },
] as const;

export type FoodTypeSlug = (typeof FOOD_TYPES)[number]['slug'];
