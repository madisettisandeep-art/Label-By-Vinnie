const fs = require('fs');

console.log('1. Reading public/style.css...');
let css = fs.readFileSync('public/style.css', 'utf8');

if (!css.includes('load-more-container')) {
  css += `

/* ==========================================================================
   PERFORMANCE: Load More & Pagination Styles
   ========================================================================== */
.load-more-container {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0 16px;
  width: 100%;
}

.btn-load-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #ffffff;
  color: var(--color-espresso);
  border: 1px solid var(--color-gold);
  padding: 13px 36px;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(200, 169, 126, 0.12);
}

.btn-load-more:hover {
  background: var(--color-espresso);
  color: var(--color-gold-light);
  border-color: var(--color-espresso);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(21, 17, 13, 0.18);
}

.btn-load-more svg {
  transition: transform 0.25s ease;
}

.btn-load-more:hover svg {
  transform: translateY(2px);
}
`;
  fs.writeFileSync('public/style.css', css);
  console.log('Appended load-more styles to public/style.css');
}

console.log('2. Reading public/script.js...');
let js = fs.readFileSync('public/script.js', 'utf8');

// 2a. Fix heroTrack selector if not already robust
js = js.replace(
  "const heroTrack = document.querySelector('.hero-pinned-track');",
  "const heroTrack = document.getElementById('hero-track') || document.querySelector('.hero-pinned-track') || document.getElementById('hero');"
);

// 2b. Add Performance Utilities near the top
const utilsMarker = 'const WHATSAPP_NUMBER = \'918106457406\';';
const utilsCode = `const WHATSAPP_NUMBER = '918106457406';

/* ==========================================================================
   PERFORMANCE UTILITIES: Debounce, Throttle & Memory Cache
   ========================================================================== */
function debounce(func, wait = 150) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit = 100) {
  let inThrottle = false;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// In-Memory Client Query / Data Cache with TTL (Checklist #1 & #6)
const ClientDataCache = new Map();
function getCachedData(key, fetcher, ttlMs = 300000) {
  const cached = ClientDataCache.get(key);
  const now = Date.now();
  if (cached && (now - cached.timestamp < ttlMs)) {
    return cached.data;
  }
  const data = typeof fetcher === 'function' ? fetcher() : fetcher;
  ClientDataCache.set(key, { data, timestamp: now });
  return data;
}
`;

if (!js.includes('PERFORMANCE UTILITIES')) {
  js = js.replace(utilsMarker, utilsCode);
  console.log('Added debounce, throttle, and query cache to script.js');
}

// 2c. Optimize Hero Scrubber to pause rAF loop when idle
const oldScrubberRegex = /\/\/ Animation Loop: LERP Video Scrubbing[\s\S]*?requestAnimationFrame\(updateVideoScrub\);[\s\S]*?requestAnimationFrame\(updateVideoScrub\);/;

const newScrubberCode = `// Hero Scrubber State: Idle-pausing loop to eliminate 60fps idle CPU usage (Checklist #15)
let isScrubbingActive = false;

function startHeroScrubbing() {
  if (!isScrubbingActive && isVideoReady && !prefersReducedMotion) {
    isScrubbingActive = true;
    requestAnimationFrame(updateVideoScrub);
  }
}

// Animation Loop: LERP Video Scrubbing (Pauses automatically when settled)
function updateVideoScrub() {
  if (isVideoReady && !prefersReducedMotion && heroVideo) {
    const diff = targetVideoTime - heroVideo.currentTime;
    if (Math.abs(diff) > 0.005) {
      heroVideo.currentTime += diff * 0.06;
      requestAnimationFrame(updateVideoScrub);
      return;
    }
  }
  isScrubbingActive = false;
}`;

if (js.match(oldScrubberRegex)) {
  js = js.replace(oldScrubberRegex, newScrubberCode);
  console.log('Optimized Hero Scrubber loop to pause when idle');
}

// Ensure onHeroScroll triggers startHeroScrubbing
if (!js.includes('startHeroScrubbing();')) {
  js = js.replace('window.addEventListener(\'scroll\', onHeroScroll', 'startHeroScrubbing();\n}\n\nwindow.addEventListener(\'scroll\', onHeroScroll');
  console.log('Wired startHeroScrubbing to onHeroScroll');
}

// 2d. Add Video Intersection Observer for Lazy Loading / Out-of-view pause (Checklist #17)
const videoObserverCode = `
/* ==========================================================================
   PERFORMANCE: IntersectionObserver for Below-the-fold Videos (Checklist #17)
   ========================================================================== */
function initVideoLazyObserver() {
  if (!('IntersectionObserver' in window)) return;
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        if (vid.paused && vid.dataset.autoplay !== 'false') {
          vid.play().catch(() => {});
        }
      } else {
        if (!vid.paused) {
          vid.pause();
        }
      }
    });
  }, { rootMargin: '100px 0px', threshold: 0.15 });

  document.querySelectorAll('video').forEach(vid => {
    if (vid.id !== 'hero-fashion-video') {
      videoObserver.observe(vid);
    }
  });
}
`;

if (!js.includes('initVideoLazyObserver')) {
  js += videoObserverCode;
  js = js.replace('initSocialReels();', 'initSocialReels();\n  initVideoLazyObserver();');
  console.log('Added Video Lazy Loading IntersectionObserver');
}

// 2e. Optimize renderProducts for pagination and unnecessary re-render elimination
const oldRenderProductsRegex = /function renderProducts\(filter = 'all', collectionTitle = null\) \{[\s\S]*?container\.classList\.add\('products-flash-highlight'\);\s*\}/;

const newRenderProductsCode = `let currentFilterCategory = null;
let currentDisplayLimit = 8;
const PAGE_CHUNK_SIZE = 8;

function loadMoreProducts() {
  currentDisplayLimit += PAGE_CHUNK_SIZE;
  renderProducts(currentFilterCategory || 'all', null, true);
}

function renderProducts(filter = 'all', collectionTitle = null, isLoadMore = false) {
  const container = document.getElementById('products-container');
  if (!container) return;

  // Checklist #15: Eliminate Unnecessary Re-renders if exact category is already active
  if (!isLoadMore && filter === currentFilterCategory && !collectionTitle) {
    return;
  }

  if (!isLoadMore) {
    currentFilterCategory = filter;
    currentDisplayLimit = PAGE_CHUNK_SIZE;
  }

  let filtered = products;
  if (filter === 'blouses') {
    filtered = products.filter(p => p.category === 'custom' || p.name.toLowerCase().includes('blouse'));
  } else if (filter === 'ethnic') {
    filtered = products.filter(p => p.category === 'ethnic');
  } else if (filter === 'chanderi') {
    filtered = products.filter(p => p.category === 'chanderi');
  } else if (filter === 'coords') {
    filtered = products.filter(p => p.name.toLowerCase().includes('set') || p.name.toLowerCase().includes('suit') || p.category === 'chanderi');
  } else if (filter === 'western') {
    filtered = products.filter(p => p.category === 'western');
  } else if (filter === 'dupattas') {
    filtered = products.filter(p => p.name.toLowerCase().includes('dupatta') || (p.description && p.description.toLowerCase().includes('dupatta')));
  } else if (filter === 'custom') {
    filtered = products.filter(p => p.category === 'custom');
  } else if (filter !== 'all') {
    filtered = products.filter(p => p.category === filter);
  }

  if (filtered.length === 0) {
    container.innerHTML = \`
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-taupe);">
        <p style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-espresso); margin-bottom: 8px;">No garments currently listed in this specific category.</p>
        <p style="font-size: 0.9rem; margin-bottom: 20px;">All our collections can be custom tailored through our bespoke atelier.</p>
        <button class="btn-primary" onclick="openCollection('all', 'All Styles')" style="display: inline-block;">View All Collections</button>
      </div>
    \`;
    return;
  }

  // Checklist #12: Paginate large lists & Chunking
  const visibleChunk = filtered.slice(0, currentDisplayLimit);
  const remainingCount = filtered.length - visibleChunk.length;

  const cardsHtml = visibleChunk.map(p => \`
    <div class="product-item" onclick="openProductModal('\${p.id}')" style="cursor: pointer;">
      <div class="product-media-wrap">
        <img src="\${p.image}" alt="\${p.name}" loading="lazy" decoding="async" />
        <span class="product-badge-tag">\${p.category.toUpperCase()}</span>
        <div class="product-view-pill">SELECT SIZE &amp; COLOUR</div>
      </div>
      <div class="product-info-wrap">
        <span class="product-cat">Pure Handcraft</span>
        <h3 class="product-title" title="\${p.name}">\${p.name}</h3>
        <p class="product-desc" title="\${p.description}">\${p.description}</p>
        <div class="product-price-row">
          <span class="product-price">₹\${p.price.toLocaleString('en-IN')}</span>
          <span class="product-sizes" title="\${p.sizes.join(' • ')}">\${p.sizes.join(' • ')}</span>
        </div>
        <div class="product-actions-row" onclick="event.stopPropagation()">
          <button class="btn-add-cart" onclick="openProductModal('\${p.id}')">CHOOSE OPTIONS</button>
          <a href="https://wa.me/\${WHATSAPP_NUMBER}?text=\${encodeURIComponent(\`Hello Label By Vinnie, I would like to enquire about: \${p.name} (₹\${p.price})\`)}" target="_blank" rel="noopener" class="btn-wa-direct" title="Instant WhatsApp Enquiry">
            💬
          </a>
        </div>
      </div>
    </div>
  \`).join('');

  const loadMoreHtml = remainingCount > 0 ? \`
    <div class="load-more-container">
      <button class="btn-load-more" onclick="loadMoreProducts()" aria-label="Load More Ensembles">
        <span>Load More Ensembles (\${remainingCount} Remaining)</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
    </div>
  \` : '';

  container.innerHTML = cardsHtml + loadMoreHtml;

  if (!isLoadMore) {
    container.classList.remove('products-flash-highlight');
    void container.offsetWidth;
    container.classList.add('products-flash-highlight');
  }
}`;

if (js.match(oldRenderProductsRegex)) {
  js = js.replace(oldRenderProductsRegex, newRenderProductsCode);
  console.log('Optimized renderProducts with pagination and re-render guards');
}

fs.writeFileSync('public/script.js', js);
console.log('Successfully updated public/script.js!');
