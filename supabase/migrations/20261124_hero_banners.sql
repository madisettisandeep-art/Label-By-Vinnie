-- ==============================================================================
-- LABEL BY VINNIE — HERO CAMPAIGN BANNERS SCHEMA & STORAGE CONFIGURATION
-- ==============================================================================

-- 1. Create hero_banners table
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Explore Collection',
  destination_url TEXT NOT NULL DEFAULT '/#shop',
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ordering and active queries
CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON public.hero_banners (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_hero_banners_active ON public.hero_banners (is_active);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies:
-- Public visitors can read active published banners
CREATE POLICY "Public visitors can view active hero banners"
  ON public.hero_banners
  FOR SELECT
  TO public
  USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at IS NULL OR ends_at >= NOW())
  );

-- Authenticated admins can perform all CRUD operations
CREATE POLICY "Authenticated admins can manage all hero banners"
  ON public.hero_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Storage Bucket for Hero Banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-banners', 'hero-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Public can read, authenticated admin can upload/manage
CREATE POLICY "Public can view hero banner images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'hero-banners');

CREATE POLICY "Authenticated admins can upload hero banner images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'hero-banners');

CREATE POLICY "Authenticated admins can update/delete hero banner images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'hero-banners')
  WITH CHECK (bucket_id = 'hero-banners');

-- 5. Initial Seed Data
INSERT INTO public.hero_banners (
  id, title, subtitle, desktop_image_url, mobile_image_url, cta_text, destination_url, display_order, is_active
) VALUES
(
  'banner-01-new-collection',
  'The New Collection',
  'Elegance, woven into every detail.',
  '/assets/campaigns/new-collection-purple-campaign.jpg',
  '/assets/campaigns/new-collection-purple-campaign.jpg',
  'Explore Collection',
  '/#shop',
  1,
  true
),
(
  'banner-02-custom-stitching',
  'Custom Stitching',
  'Tailored to your elegance.',
  '/assets/campaigns/custom-stitching-campaign.jpg',
  '/assets/campaigns/custom-stitching-campaign.jpg',
  'Discover More',
  '/custom-stitching',
  2,
  true
),
(
  'banner-03-timeless-ethnic',
  'Timeless. Elegant. Yours.',
  'Discover the art of Indian ethnic fashion.',
  '/assets/campaigns/timeless-ethnic-fashion.jpg',
  '/assets/campaigns/timeless-ethnic-fashion.jpg',
  'Shop Now',
  '/#shop',
  3,
  true
),
(
  'banner-04-new-arrivals',
  'New Arrivals',
  'Contemporary cuts meet authentic craftsmanship.',
  '/assets/campaigns/the-new-collection-clean.jpg',
  '/assets/campaigns/the-new-collection-clean.jpg',
  'View Arrivals',
  '/#shop',
  4,
  true
),
(
  'banner-05-special-offers',
  'Special Offers',
  'Festive handcrafted ensembles curated for you.',
  '/assets/campaigns/new-collection-purple-campaign.jpg',
  '/assets/campaigns/new-collection-purple-campaign.jpg',
  'Enquire on WhatsApp',
  'https://wa.me/918106457406?text=Hello%20Vinnie%2C%20I%20would%20like%20to%20enquire%20about%20the%20Special%20Offers%20collection.',
  5,
  true
),
(
  'banner-06-best-sellers',
  'Best Sellers',
  'Most cherished bridal and designer edits.',
  '/assets/campaigns/timeless-ethnic-fashion.jpg',
  '/assets/campaigns/timeless-ethnic-fashion.jpg',
  'Explore Best Sellers',
  '/#collections',
  6,
  true
)
ON CONFLICT (id) DO NOTHING;
