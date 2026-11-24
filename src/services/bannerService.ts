import { HeroBanner } from '@/types';
import { supabase } from '@/lib/supabase/client';

export const DEFAULT_CAMPAIGN_BANNERS: HeroBanner[] = [
  {
    id: 'banner-01-new-collection',
    title: 'The New Collection',
    subtitle: 'Elegance, woven into every detail.',
    desktop_image_url: '/assets/campaigns/new-collection-purple-campaign.jpg',
    mobile_image_url: '/assets/campaigns/new-collection-purple-campaign.jpg',
    cta_text: 'Explore Collection',
    destination_url: '/#shop',
    display_order: 1,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '2026-11-24T10:00:00Z',
    updated_at: '2026-11-24T10:00:00Z',
  },
  {
    id: 'banner-02-custom-stitching',
    title: 'Custom Stitching',
    subtitle: 'Tailored to your elegance.',
    desktop_image_url: '/assets/campaigns/custom-stitching-campaign.jpg',
    mobile_image_url: '/assets/campaigns/custom-stitching-campaign.jpg',
    cta_text: 'Discover More',
    destination_url: '/custom-stitching',
    display_order: 2,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '2026-11-24T10:00:00Z',
    updated_at: '2026-11-24T10:00:00Z',
  },
  {
    id: 'banner-03-timeless-ethnic',
    title: 'Timeless. Elegant. Yours.',
    subtitle: 'Discover the art of Indian ethnic fashion.',
    desktop_image_url: '/assets/campaigns/timeless-ethnic-fashion.jpg',
    mobile_image_url: '/assets/campaigns/timeless-ethnic-fashion.jpg',
    cta_text: 'Shop Now',
    destination_url: '/#shop',
    display_order: 3,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '2026-11-24T10:00:00Z',
    updated_at: '2026-11-24T10:00:00Z',
  },
  {
    id: 'banner-04-new-arrivals',
    title: 'New Arrivals',
    subtitle: 'Contemporary cuts meet authentic craftsmanship.',
    desktop_image_url: '/assets/campaigns/the-new-collection-clean.jpg',
    mobile_image_url: '/assets/campaigns/the-new-collection-clean.jpg',
    cta_text: 'View Arrivals',
    destination_url: '/#shop',
    display_order: 4,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '2026-11-24T10:00:00Z',
    updated_at: '2026-11-24T10:00:00Z',
  },
  {
    id: 'banner-05-special-offers',
    title: 'Special Offers',
    subtitle: 'Festive handcrafted ensembles curated for you.',
    desktop_image_url: '/assets/campaigns/new-collection-purple-campaign.jpg',
    mobile_image_url: '/assets/campaigns/new-collection-purple-campaign.jpg',
    cta_text: 'Enquire on WhatsApp',
    destination_url: 'https://wa.me/918106457406?text=Hello%20Vinnie%2C%20I%20would%20like%20to%20enquire%20about%20the%20Special%20Offers%20collection.',
    display_order: 5,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '2026-11-24T10:00:00Z',
    updated_at: '2026-11-24T10:00:00Z',
  },
  {
    id: 'banner-06-best-sellers',
    title: 'Best Sellers',
    subtitle: 'Most cherished bridal and designer edits.',
    desktop_image_url: '/assets/campaigns/timeless-ethnic-fashion.jpg',
    mobile_image_url: '/assets/campaigns/timeless-ethnic-fashion.jpg',
    cta_text: 'Explore Best Sellers',
    destination_url: '/#collections',
    display_order: 6,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '2026-11-24T10:00:00Z',
    updated_at: '2026-11-24T10:00:00Z',
  },
];

const STORAGE_KEY = 'lbv_hero_banners';

/**
 * Retrieve active hero campaign banners for the public website.
 * Filters by is_active === true and scheduling window (starts_at / ends_at).
 */
export function getActiveBanners(): HeroBanner[] {
  if (typeof window === 'undefined') {
    return DEFAULT_CAMPAIGN_BANNERS.filter((b) => b.is_active);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const banners: HeroBanner[] = raw ? JSON.parse(raw) : DEFAULT_CAMPAIGN_BANNERS;
    const now = new Date();

    return banners
      .filter((b) => {
        if (!b.is_active) return false;
        if (b.starts_at && new Date(b.starts_at) > now) return false;
        if (b.ends_at && new Date(b.ends_at) < now) return false;
        return true;
      })
      .sort((a, b) => a.display_order - b.display_order);
  } catch (err) {
    console.warn('Error reading banners from storage', err);
    return DEFAULT_CAMPAIGN_BANNERS.filter((b) => b.is_active);
  }
}

/**
 * Retrieve all campaign banners for Admin Dashboard management.
 */
export function getAllBanners(): HeroBanner[] {
  if (typeof window === 'undefined') {
    return DEFAULT_CAMPAIGN_BANNERS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CAMPAIGN_BANNERS));
      return DEFAULT_CAMPAIGN_BANNERS;
    }
    const banners: HeroBanner[] = JSON.parse(raw);
    return banners.sort((a, b) => a.display_order - b.display_order);
  } catch (err) {
    console.warn('Error reading all banners from storage', err);
    return DEFAULT_CAMPAIGN_BANNERS;
  }
}

/**
 * Save updated list of banners to persistent storage and optionally sync with Supabase.
 */
export async function saveBanners(banners: HeroBanner[]): Promise<boolean> {
  const sorted = [...banners].sort((a, b) => a.display_order - b.display_order);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
      window.dispatchEvent(new CustomEvent('lbv-banners-updated'));
    } catch (err) {
      console.warn('Failed to save banners to localStorage', err);
    }
  }

  // Attempt Supabase synchronization if configured
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('hero_banners').upsert(sorted);
      if (error) {
        console.warn('Supabase banner sync notification:', error.message);
      }
    }
  } catch {
    // Graceful offline fallback
  }

  return true;
}

/**
 * Add a new campaign banner.
 */
export async function createBanner(
  data: Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'>
): Promise<HeroBanner> {
  const existing = getAllBanners();
  const newBanner: HeroBanner = {
    ...data,
    id: `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updated = [...existing, newBanner];
  await saveBanners(updated);
  return newBanner;
}

/**
 * Update an existing campaign banner by ID.
 */
export async function updateBanner(
  id: string,
  updates: Partial<Omit<HeroBanner, 'id' | 'created_at'>>
): Promise<boolean> {
  const existing = getAllBanners();
  const index = existing.findIndex((b) => b.id === id);
  if (index === -1) return false;

  existing[index] = {
    ...existing[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await saveBanners(existing);
  return true;
}

/**
 * Delete a campaign banner by ID.
 */
export async function deleteBanner(id: string): Promise<boolean> {
  const existing = getAllBanners();
  const filtered = existing.filter((b) => b.id !== id);
  await saveBanners(filtered);
  return true;
}

/**
 * Reorder banners based on an ordered array of banner IDs.
 */
export async function reorderBanners(orderedIds: string[]): Promise<boolean> {
  const existing = getAllBanners();
  const updated = existing.map((b) => {
    const newOrder = orderedIds.indexOf(b.id);
    return newOrder > -1
      ? { ...b, display_order: newOrder + 1, updated_at: new Date().toISOString() }
      : b;
  });

  await saveBanners(updated);
  return true;
}

/**
 * Reset banners to initial campaign defaults.
 */
export async function resetBannersToDefault(): Promise<HeroBanner[]> {
  await saveBanners(DEFAULT_CAMPAIGN_BANNERS);
  return DEFAULT_CAMPAIGN_BANNERS;
}