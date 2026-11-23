-- ==============================================================================
-- LABEL BY VINNIE: PRODUCTION SUPABASE POSTGRESQL SCHEMA WITH RLS & AUDITING
-- Currency: INR (Stored as integer minor units: 1 INR = 100 paise, or exact integers)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, role)
);

-- 2. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  street_address TEXT NOT NULL,
  apartment_or_villa TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'India' NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CATEGORIES & COLLECTIONS
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_number TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_image TEXT,
  accent_color TEXT DEFAULT '#C5A059',
  is_published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCTS & INVENTORY
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  price_inr INT NOT NULL CHECK (price_inr >= 0),
  description TEXT NOT NULL,
  fabric_details TEXT,
  care_instructions TEXT[],
  details TEXT[],
  is_in_stock BOOLEAN DEFAULT true NOT NULL,
  is_made_to_order BOOLEAN DEFAULT false NOT NULL,
  is_published BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT,
  stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(product_id, size, color)
);

-- 5. ORDERS & ORDER ITEMS (Primary WhatsApp Flow)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_reference TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_state TEXT NOT NULL,
  delivery_postal_code TEXT,
  order_notes TEXT,
  subtotal_inr INT NOT NULL CHECK (subtotal_inr >= 0),
  shipping_inr INT DEFAULT 0 CHECK (shipping_inr >= 0),
  total_inr INT NOT NULL CHECK (total_inr >= 0),
  status TEXT DEFAULT 'PENDING_WHATSAPP_CONFIRMATION' NOT NULL CHECK (
    status IN (
      'DRAFT',
      'PENDING_WHATSAPP_CONFIRMATION',
      'CONFIRMED',
      'PROCESSING',
      'READY_FOR_DISPATCH',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED'
    )
  ),
  whatsapp_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT,
  unit_price_inr INT NOT NULL CHECK (unit_price_inr >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal_inr INT NOT NULL CHECK (subtotal_inr >= 0),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BESPOKE STITCHING STUDIO
CREATE TABLE IF NOT EXISTS public.measurement_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_name TEXT DEFAULT 'My Measurements' NOT NULL,
  unit TEXT DEFAULT 'inches' CHECK (unit IN ('inches', 'cm')),
  bust NUMERIC(5,2),
  waist NUMERIC(5,2),
  hip NUMERIC(5,2),
  shoulder NUMERIC(5,2),
  armhole NUMERIC(5,2),
  sleeve_length NUMERIC(5,2),
  garment_length NUMERIC(5,2),
  front_neck_depth NUMERIC(5,2),
  back_neck_depth NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.stitching_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  garment_type TEXT NOT NULL,
  fabric_type TEXT NOT NULL,
  measurement_data JSONB NOT NULL,
  design_notes TEXT,
  reference_image_urls TEXT[],
  status TEXT DEFAULT 'PENDING_REVIEW' CHECK (
    status IN ('PENDING_REVIEW', 'QUOTATION_SENT', 'CONFIRMED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED')
  ),
  admin_quotation_inr INT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. AUDIT LOGGING
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stitching_requests ENABLE ROW LEVEL SECURITY;

-- Public can view published products and collections
CREATE POLICY "Public can view published products"
  ON public.products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view published collections"
  ON public.collections FOR SELECT
  USING (is_published = true);

-- Profiles: users read and update their own
CREATE POLICY "Users can manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- Orders: users read their own orders; anyone can insert a guest order request
CREATE POLICY "Anyone can submit an order request"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit stitching requests"
  ON public.stitching_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own stitching requests"
  ON public.stitching_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('product-images', 'product-images', true),
  ('collection-images', 'collection-images', true),
  ('brand-assets', 'brand-assets', true),
  ('stitching-references', 'stitching-references', false)
ON CONFLICT (id) DO NOTHING;
