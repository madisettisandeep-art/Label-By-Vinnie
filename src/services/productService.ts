import { Product, Collection } from '@/types';

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-01',
    number: '01',
    title: 'Ethnic Elegance',
    slug: 'ethnic-elegance',
    subtitle: 'Heritage Weaves & Timeless Grace',
    description: 'Lehengas, kurtis, salwar suits, ethnic ensembles and traditional designer wear.',
    coverImage: '/assets/collections/ethnic-bandhani-dress.jpg',
    accent: '#C5A059',
  },
  {
    id: 'col-02',
    number: '02',
    title: 'Western Edition',
    slug: 'western-edition',
    subtitle: 'Contemporary Silhouettes & Evening Drapes',
    description: 'Designer dresses, evening gowns, structured tunics and contemporary western clothing.',
    coverImage: '/assets/collections/kolam-contemporary-fusion-ensemble.jpg',
    accent: '#A18F78',
  },
  {
    id: 'col-03',
    number: '03',
    title: 'Contemporary Style',
    slug: 'contemporary-style',
    subtitle: 'Modern Fusion & Coordinated Sets',
    description: 'Indo-western fashion, festive co-ord sets, contemporary kurtas and modern cuts.',
    coverImage: '/assets/collections/banarasi-chanderi-reel-poster.jpg',
    accent: '#67471A',
  },
  {
    id: 'col-04',
    number: '04',
    title: 'Custom Couture',
    slug: 'custom-couture',
    subtitle: 'Bespoke Creations & Artisanal Detailing',
    description: 'Personalised outfits, hand-embroidered pearls, made-to-measure blouses and customised creations.',
    coverImage: '/assets/collections/fav-picks-pearl-embroidery.jpg',
    accent: '#D8C8AD',
  },
];

export const VERIFIED_PRODUCTS: Product[] = [
  {
    id: 'lbv-prod-01',
    name: 'Bandhani A-Line Kurta & Matching Dupatta',
    slug: 'bandhani-a-line-kurta-dupatta',
    category: 'ethnic',
    categoryTitle: 'Ethnic Elegance',
    price: 4850,
    description:
      'A beautiful Bandhani A-line kurta paired with a matching dupatta, bringing together the charm of traditional prints and effortless ethnic style. Perfect for festive celebrations and graceful everyday occasions.',
    details: [
      'Authentic handcrafted Bandhani pattern',
      'Flattering A-line silhouette with graceful side slits',
      'Matching full-length Bandhani dupatta with hand-finished hem',
      'Breathable, premium natural cotton silk blend',
      'Sleeves finished with delicate piping detail',
    ],
    fabric: 'Pure Cotton Silk with Traditional Bandhani Tie-Dye',
    care: ['Dry clean only for first 2 washes', 'Cold gentle hand wash thereafter', 'Medium iron on reverse'],
    images: [
      '/assets/products/bandhani-aline-kurta-dupatta.jpg',
      '/assets/collections/ethnic-bandhani-dress.jpg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitching'],
    colors: ['Ruby Red / Golden Cream'],
    inStock: true,
    madeToOrder: false,
    isDraft: false,
  },
  {
    id: 'lbv-prod-02',
    name: 'Pista Green Bandhani 3-Piece Palazzo Set',
    slug: 'pista-green-bandhani-3-piece-set',
    category: 'ethnic',
    categoryTitle: 'Ethnic Elegance',
    price: 5950,
    description:
      'A quiet glow of Bhandini woven in serene pista green. Features a tailored kurta, matching woven dupatta, and comfortable flared palazzo pants.',
    details: [
      'Complete 3-piece ensemble (Kurta, Dupatta, Palazzo)',
      'Intricate micro-Bandhani dot motifs',
      'Lined with soft mulmul cotton for all-day comfort',
      'Comfortable elasticated palazzo waistband with drawstrings',
    ],
    fabric: 'Fine Woven Bandhani Chanderi & Mulmul Lining',
    care: ['Gentle dry clean recommended', 'Steam iron or warm reverse iron'],
    images: [
      '/assets/products/pista-green-bandhani-3piece-set.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'Custom Fit'],
    colors: ['Pista Green'],
    inStock: true,
    madeToOrder: false,
    isDraft: false,
  },
  {
    id: 'lbv-prod-03',
    name: 'Chanderi Zari Booti 3-Piece Suit Ensemble',
    slug: 'chanderi-zari-booti-suit-set',
    category: 'chanderi',
    categoryTitle: 'Banarasi & Chanderi',
    price: 6400,
    description:
      'Chanderi zari booti top, matching zari booti dupatta and comfortable Santoon bottom. Crafted in earthy olive green with hand-woven golden motifs.',
    details: [
      'Top: Authentic Chanderi silk with woven zari booti',
      'Dupatta: Pure Chanderi woven zari work with tasseled borders',
      'Bottom: Dyed Santoon silk fabric',
      'Classic festive and occasion wear',
    ],
    fabric: 'Pure Chanderi Silk with Golden Zari Weaving',
    care: ['Dry clean only'],
    images: [
      '/assets/products/chanderi-zari-booti-suit-set.jpg',
      '/assets/products/chanderi-zari-booti-set-main.jpg',
      '/assets/products/chanderi-zari-color-variant.jpg',
      '/assets/products/chanderi-zari-dupatta-drape.jpg',
      '/assets/fabrics/chanderi-zari-weave-texture.jpg',
    ],
    sizes: ['Unstitched Fabric Set', 'Custom Tailored to Measure'],
    colors: ['Olive Green / Antique Gold Zari'],
    inStock: true,
    madeToOrder: false,
    isDraft: false,
  },
  {
    id: 'lbv-prod-04',
    name: 'Exclusive Banarasi Chanderi Hand Mirror Work Set',
    slug: 'banarasi-chanderi-mirror-work-set',
    category: 'chanderi',
    categoryTitle: 'Banarasi & Chanderi',
    price: 7200,
    description:
      'Pure Chanderi hand mirror work booti top paired with Banarasi Chanderi contrast dupatta with zari border and Santoon bottom. In regal royal purple.',
    details: [
      'Top: Pure Chanderi with authentic handcrafted mirror work',
      'Dupatta: Contrast Banarasi Chanderi with broad zari pallu',
      'Bottom: Premium Santoon silk',
      'Hand-finished by master craftspeople',
    ],
    fabric: 'Banarasi Chanderi Silk with Hand Mirror Work',
    care: ['Specialist dry clean only'],
    images: [
      '/assets/products/exclusive-banarasi-chanderi-mirror-set.jpg',
      '/assets/products/banarasi-chanderi-pink-set-main.jpg',
      '/assets/products/banarasi-chanderi-flatlay-ensemble.jpg',
      '/assets/fabrics/banarasi-hand-mirror-work-detail.jpg',
    ],
    sizes: ['Fabric Material (Unstitched)', 'Bespoke Stitched by Vinnie'],
    colors: ['Royal Lilac Purple / Warm Gold'],
    inStock: true,
    madeToOrder: false,
    isDraft: false,
  },
  {
    id: 'lbv-prod-05',
    name: 'Bespoke Navy Blue Designer Blouse with Zari Border',
    slug: 'bespoke-navy-blue-designer-blouse',
    category: 'custom',
    categoryTitle: 'Custom Couture',
    price: 3650,
    description:
      'Artisanal navy blue blouse featuring dual handcrafted sleeve looks: intricate potli buttons and graceful elbow-length styling with golden zari borders.',
    details: [
      'Available in 2 distinct artisanal styles: Potli Sleeves or Sweetheart Neck',
      'Premium heavy silk fabric with soft cotton lining',
      'Handmade latkan tie-ups at back neck',
      'Inbuilt padding with double-stitched reinforced seams',
    ],
    fabric: 'Heavy Silk Blend with Zari Brocade Border',
    care: ['Gentle dry clean only', 'Store in cotton garment bag'],
    images: [
      '/assets/stitching/navy-blue-zari-border-blouse.jpg',
    ],
    sizes: ['Custom Sized to Measure', '32', '34', '36', '38', '40', '42'],
    colors: ['Navy Blue / Gold Border'],
    inStock: true,
    madeToOrder: true,
    isDraft: false,
  },
  {
    id: 'lbv-prod-06',
    name: 'Ivory Floral Cutwork Handcrafted Blouse',
    slug: 'ivory-floral-cutwork-blouse',
    category: 'couture',
    categoryTitle: 'Custom Couture',
    price: 4200,
    description:
      'Exquisite ivory embroidered blouse featuring delicate floral cutwork, graceful neck detailing, and timeless artistry. Simple, timeless, and effortlessly beautiful.',
    details: [
      'Handcrafted floral cutwork along the neckline and hem',
      'Subtle metallic thread embroidery',
      'Breathable mulmul silk base',
      'Custom back closure (potli buttons or tie-up tassels)',
    ],
    fabric: 'Raw Silk & Fine Net Cutwork Embroidery',
    care: ['Delicate dry clean only'],
    images: [
      '/assets/stitching/ivory-cutwork-designer-blouse.jpg',
    ],
    sizes: ['Custom Sized to Measure', '34', '36', '38', '40'],
    colors: ['Antique Ivory / Champagne Gold'],
    inStock: true,
    madeToOrder: true,
    isDraft: false,
  },
];

// High-Performance In-Memory Index Maps (O(1) lookups instead of repeated O(N) scans)
const PRODUCT_MAP_BY_SLUG = new Map<string, Product>();
const PRODUCT_MAP_BY_ID = new Map<string, Product>();
const CATEGORY_CACHE = new Map<string, Product[]>();
const COLLECTION_MAP_BY_SLUG = new Map<string, Collection>();

// Pre-index records on module load
VERIFIED_PRODUCTS.forEach((p) => {
  PRODUCT_MAP_BY_SLUG.set(p.slug, p);
  PRODUCT_MAP_BY_ID.set(p.id, p);
  const catList = CATEGORY_CACHE.get(p.category) || [];
  catList.push(p);
  CATEGORY_CACHE.set(p.category, catList);
});

COLLECTIONS.forEach((c) => {
  COLLECTION_MAP_BY_SLUG.set(c.slug, c);
});

export function getAllProducts(): Product[] {
  return VERIFIED_PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCT_MAP_BY_SLUG.get(slug) || PRODUCT_MAP_BY_ID.get(slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return VERIFIED_PRODUCTS;
  return CATEGORY_CACHE.get(category) || [];
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTION_MAP_BY_SLUG.get(slug);
}
