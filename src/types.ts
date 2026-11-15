export enum WaitlistType {
  Customer = 'customer',
  Vendor = 'vendor',
}

export enum DeliveryPreference {
  Yes = 'Yes',
  No = 'No',
  Sometimes = 'Sometimes',
}

export enum AreaOption {
  IjebuOde = 'Ijebu Ode',
  Ijagun = 'Ijagun (TASUED)',
  OtherNearIjebuOde = 'Other areas near Ijebu Ode',
  Other = 'Other',
}

export type StudentOption = 'Yes, at TASUED' | 'Yes, somewhere else' | 'No';

export type ThemeMode = 'dark' | 'light';

export interface FoodPhotoSlot {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tag: string;
}

export interface WaitlistPayload {
  type: WaitlistType;
  fullName: string;
  whatsapp: string;
  email: string;
  area: AreaOption;
  contactConsent: boolean;
  student: 'Yes, at TASUED' | 'Yes, somewhere else' | 'No' | '';
  searches: string[];
  businessName: string;
  category: string;
  delivers: DeliveryPreference | '';
  address: string;
  operatingModel: string;
  operatingLocations: string[];
  businessDescription: string;
  otherCategory: string;
  foodCategories: string[];
  fulfilmentOptions: string[];
  socialMediaLink: string;
  additionalComments: string;
  source: 'website';
  website: string;
}
