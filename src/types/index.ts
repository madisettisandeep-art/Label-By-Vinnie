export type OrderStatus =
  | 'DRAFT'
  | 'PENDING_WHATSAPP_CONFIRMATION'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_DISPATCH'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'ethnic' | 'western' | 'contemporary' | 'couture' | 'chanderi' | 'custom' | string;
  categoryTitle: string;
  price: number; // in INR
  description: string;
  details: string[];
  fabric: string;
  care: string[];
  images: string[];
  sizes: string[];
  colors?: string[];
  inStock: boolean;
  madeToOrder: boolean;
  isDraft: boolean;
}

export interface Collection {
  id: string;
  number: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  coverImage: string;
  accent: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  basePrice?: number;
  image: string;
  size: string;
  color?: string;
  stitchingOption?: 'standard' | 'custom' | 'unstitched';
  stitchingPrice?: number;
  customMeasurements?: Record<string, string>;
  fittingNotes?: string;
  quantity: number;
  isCustom?: boolean;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderReference: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StitchingMeasurements {
  bust: number | null;
  waist: number | null;
  hip: number | null;
  shoulder: number | null;
  armhole: number | null;
  sleeveLength: number | null;
  garmentLength: number | null;
  frontNeckDepth: number | null;
  backNeckDepth: number | null;
  unit: 'inches' | 'cm';
}

export interface CustomStitchingEnquiry {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerPhone: string;
  garmentType: string;
  fabricType: string;
  measurements: StitchingMeasurements;
  designNotes: string;
  preferredDate?: string;
  status: 'PENDING_REVIEW' | 'QUOTATION_SENT' | 'CONFIRMED' | 'IN_PRODUCTION' | 'COMPLETED';
  createdAt: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  desktop_image_url: string;
  mobile_image_url?: string;
  cta_text: string;
  destination_url: string;
  display_order: number;
  is_active: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
