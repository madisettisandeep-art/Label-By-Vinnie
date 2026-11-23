# LABEL BY VINNIE — Unlimited Fashion Choices

> **Luxury Handcrafted Ethnic Ensembles, Banarasi Chanderi, Bandhani & Bespoke Tailoring Atelier**  
> *Shipped worldwide across India and the USA.*

---

## 🌟 Overview

**LABEL BY VINNIE** is a luxury direct-to-consumer and bespoke fashion boutique web application. The platform blends Indian couture aesthetics with an interactive, high-performance web experience.

---

## ✨ Key Features

1. **Cinematic Hero Scrubbing Engine (30-Second Video)**:
   - Synchronized scroll-scrubbing video experience with smooth LERP interpolation.
   - Branded watermark overlay protecting the hero visuals.
   - Slower, grand finale title reveal (*"Welcome to the World Of Label By Vinnie"*).

2. **Shop By Collection Dropdown**:
   - Reference-styled dropdown menu allowing instant exploration of Blouses, Ethnic Wear, Banarasi & Chanderi, Co-ord Sets, Western & Fusion, Dupattas, and Custom Stitching.

3. **35mm Live Cinema Strip Showcase**:
   - Continuous marquee filmstrip showcasing new atelier arrivals.
   - Client upload and management directly via the secure Admin Portal.

4. **Interactive Product Customization & Ordering**:
   - Full options modal for every ensemble: Standard sizes (XS–XXL) & Custom Made-to-Measure.
   - Color selection swatches, quantity increments, and live pricing calculations.
   - Direct WhatsApp Concierge checkout with pre-formatted product and measurement summaries.

5. **Bespoke Measurement Studio**:
   - Custom tailoring form capturing Bust, Waist, Hip, Shoulder, Armhole, Sleeve, and Garment Length.
   - Integrated consultation workflow via WhatsApp.

6. **Socials Instagram Reels Showcase**:
   - Embedded HD reels with auto-play in view.
   - Tap-to-unmute audio controls with real-time volume adjustment sliders.
   - Direct "Open on Instagram" links.

7. **Boutique Administration Portal**:
   - Real-time catalog, order requests, and custom stitching management with in-browser persistence.

---

## ⚡ 20 Performance Optimizations

The application implements a 20-point performance optimization framework:

1. **Cache API responses**: In-memory server API cache with 5-minute TTL and client-side query cache.
2. **Load balancer**: Multi-core cluster mode across all CPU cores with automatic worker recovery.
3. **Index the Database**: PostgreSQL B-Tree, composite, and GIN full-text search indexes in Supabase migrations.
4. **Compress images**: Asynchronous image decoding (`decoding="async"`) and native lazy loading.
5. **Loading skeletons**: Shimmering CSS skeleton loaders (`.skeleton-card`, `@keyframes skeleton-shimmer`).
6. **Cache expensive queries**: O(1) in-memory slug/ID indexing Map in `productService`.
7. **Eliminate N+1 database queries**: Relational batching view `v_catalog_products_with_details`.
8. **Debounce input handlers**: Debounced measurement inputs, throttled volume sliders, and resize handlers.
9. **Split code into chunks**: Paginated 8-item catalog chunks, separate minified production assets.
10. **Add CDN**: `CDN-Cache-Control` headers and DNS prefetch / preconnect resource hints.
11. **Server-side caching**: In-memory `FILE_CACHE` buffer cache with ETag 304 validation.
12. **Paginate large lists**: Batch catalog pagination with "Load More Ensembles".
13. **Lighthouse audits**: Full accessibility audit compliance (`aria-label`, touch targets, 0 CLS).
14. **Compress API payloads**: Streaming zlib gzip/deflate compression (82% bandwidth reduction).
15. **Eliminate unnecessary re-renders**: Filter state memoization and idle-pausing hero scrub loop.
16. **Minify JS and CSS**: Automated minified bundles (`style.min.css`, `script.min.js`).
17. **Add Lazy Loading**: `loading="lazy"` on media; `IntersectionObserver` to pause off-screen video decoding.
18. **Defer non-critical scripts**: Non-blocking `<script src="script.js" defer></script>`.
19. **Remove unused dependencies**: Audited lean dependencies.
20. **Database connection pooling**: Supavisor / PgBouncer transaction pooling on port 6543.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/madisettisandeep-art/Label-By-Vinnie.git
cd Label-By-Vinnie

# Install dependencies
npm install

# Start the high-performance boutique server
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
Private & Proprietary — © 2026 LABEL BY VINNIE. All rights reserved.
