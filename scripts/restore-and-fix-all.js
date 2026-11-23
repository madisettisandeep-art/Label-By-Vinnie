const fs = require('fs');

console.log('--- RESTORING & PERFECTING WEB APPLICATION ---');

const ALL_10_REELS = [
  {
    index: 1,
    file: '01_a_beautiful_bandhani_a_line_ku_DfWb-hVttke.mp4',
    code: 'DfWb-hVttke',
    caption: 'Bandhani A-Line Kurta &amp; Dupatta'
  },
  {
    index: 2,
    file: '02_wrapped_in_tradition_styled_wi_DdYUOM_N9YX.mp4',
    code: 'DdYUOM_N9YX',
    caption: 'Wrapped in Tradition Bandhani'
  },
  {
    index: 3,
    file: '03_a_quiet_glow_of_bhandini_woven_DTzLQgDiZ0B.mp4',
    code: 'DTzLQgDiZ0B',
    caption: 'Pista Green Bandhani Glow'
  },
  {
    index: 4,
    file: '04_blouse_customisation_available_Df6R-HFtvFo.mp4',
    code: 'Df6R-HFtvFo',
    caption: 'Custom Blouse Detailing'
  },
  {
    index: 5,
    file: '05_a_beautiful_navy_blue_designer_DfohqqltYqh.mp4',
    code: 'DfohqqltYqh',
    caption: 'Bespoke Navy Blue Couture'
  },
  {
    index: 6,
    file: '06_label_by_vinnie_fav_picks_DfkIEygNh2_.mp4',
    code: 'DfkIEygNh2_',
    caption: 'Signature Atelier Fav Picks'
  },
  {
    index: 7,
    file: '07_elegance_in_every_detail_DfXfzskzB_j.mp4',
    code: 'DfXfzskzB_j',
    caption: 'Designer Sweetheart Blouse'
  },
  {
    index: 8,
    file: '09_chanderi_zari_booti_top_DfEtSH3NdhZ.mp4',
    code: 'DfEtSH3NdhZ',
    caption: 'Chanderi Zari Booti Suit'
  },
  {
    index: 9,
    file: '11_exclusive_banarasi_chanderi_co_DdsugmFtGR5.mp4',
    code: 'DdsugmFtGR5',
    caption: 'Banarasi Chanderi Mirror Set'
  },
  {
    index: 10,
    file: '12_where_tradition_meets_contempo_DdBXuWGt0R3.mp4',
    code: 'DdBXuWGt0R3',
    caption: 'Contemporary Silk Gown'
  }
];

function generateReelCard(reel) {
  return `        <!-- Reel ${reel.index}: ${reel.caption} -->
        <div class="insta-tile-video-card" data-reel-index="${reel.index}">
          <video
            class="social-reel-video"
            src="/videos/${reel.file}"
            autoplay
            loop
            muted
            playsinline
            preload="auto"
          ></video>

          <div class="social-sound-control-group">
            <div class="social-volume-panel" id="vol-panel-${reel.index}">
              <input type="range" min="0" max="1" step="0.05" value="0.8" class="social-volume-slider" aria-label="Volume Slider" />
              <span class="social-volume-pct">80%</span>
            </div>
            <button type="button" class="social-audio-btn is-muted" aria-label="Toggle Audio &amp; Volume" title="Tap for volume">
              <svg class="audio-icon icon-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
              <svg class="audio-icon icon-unmuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>
          </div>

          <div class="social-audio-toast">Muted 🔇</div>

          <a href="https://www.instagram.com/reel/${reel.code}/" target="_blank" rel="noopener noreferrer" class="social-insta-overlay" aria-label="Open on Instagram">
            <div class="social-insta-btn">
              <svg class="social-insta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Open on Instagram</span>
            </div>
            <span class="social-insta-caption">${reel.caption}</span>
          </a>
        </div>`;
}

// 1. Read public/index.html
let html = fs.readFileSync('public/index.html', 'utf8');

// 2. Fix Hero Section
const properHero = `  <!-- C. Phase 2 & 5: Cinematic Hero Section with Controlled Scrubbing Video -->
  <section id="hero" class="cinematic-hero-section hero-scroll-section">
    <!-- Pinned 1200vh Scroll Track -->
    <div class="hero-pinned-track hero-track" id="hero-track">
      <div class="hero-sticky-viewport hero-sticky-stage">
        <!-- 30-Second Cinematic Hero Video -->
        <video
          id="hero-fashion-video"
          src="/assets/hero/hero-video.mp4"
          poster="/assets/hero/frames/frame_0001.jpg"
          muted
          playsinline
          preload="auto"
          class="hero-video hero-video-frame"
          aria-label="Label by Vinnie 30s 3D Fashion Animation"
        ></video>

        <!-- Brand Watermark Logo Badge (Covering Google Flow mark throughout Hero) -->
        <div class="hero-watermark-cover hero-watermark-overlay" id="hero-watermark-overlay" aria-hidden="true">
          <img src="/assets/brand/logo.jpg" alt="Label By Vinnie Logo" class="hero-watermark-logo-img" />
          <span class="hero-watermark-brand-name hero-watermark-text">LABEL BY VINNIE</span>
        </div>

        <!-- End of Scroll Grand Welcome Title -->
        <div class="hero-welcome-overlay" id="hero-welcome-overlay">
          <div class="hero-welcome-content">
            <span class="welcome-top-tag" style="display:block; font-size:0.75rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--color-champagne-gold); margin-bottom:12px; font-weight:600;">UNLIMITED FASHION CHOICES</span>
            <h2 class="hero-welcome-title welcome-grand-heading">Welcome to the World Of<br /><span class="brand-glow" style="color:var(--color-champagne-gold);">Label By Vinnie</span></h2>
            <p class="hero-welcome-subtitle welcome-sub">Authentic Banarasi Chanderi &bull; Handloom Bandhani &bull; Bespoke Tailoring</p>
            <a href="#shop" class="hero-welcome-btn btn-welcome-explore">BEST SELLERS &darr;</a>
          </div>
        </div>

        <!-- Thin Vertical Scroll Progress Line (Right Side) -->
        <div class="hero-scroll-indicator-right hero-timeline-track" aria-hidden="true">
          <div class="hero-scroll-indicator-fill hero-timeline-progress" id="hero-timeline-progress"></div>
        </div>
      </div>
    </div>
  </section>`;

const heroRegex = /<!-- C\. Phase 2[\s\S]*?<\/section>/;
if (html.match(heroRegex)) {
  html = html.replace(heroRegex, properHero);
  console.log('Restored Hero Section with correct classes & /assets/hero/hero-video.mp4');
}

// 3. Fix Social Reels Grid (All 10 reels)
const reelsGridHtml = `      <div class="instagram-reel-grid" id="social-reels-grid">\n` + 
  ALL_10_REELS.map(generateReelCard).join('\n\n') + 
  `\n      </div>`;

const socialGridRegex = /<div class="instagram-reel-grid" id="social-reels-grid">[\s\S]*?<\/div>\s*<\/section>/;
const newSocialSection = reelsGridHtml + `\n  </section>`;
if (html.match(socialGridRegex)) {
  html = html.replace(socialGridRegex, newSocialSection);
  console.log('Restored Follow Us On Instagram with all 10 video reels, sound sliders, and hover links');
}

// 4. Fix Luxury Footer (4 Columns, dark background, 100% visible text)
const properFooter = `  <!-- I. Luxury Dark Footer -->
  <footer id="contact" class="luxury-footer site-footer">
    <div class="site-container">
      <div class="footer-top-grid">
        <!-- Col 1: Brand -->
        <div class="footer-col footer-brand-col">
          <div class="footer-logo-row">
            <img src="/assets/brand/logo.jpg" alt="Label By Vinnie" class="footer-logo" />
            <span class="footer-brand-title">LABEL BY VINNIE</span>
          </div>
          <p class="footer-mission">
            Bespoke women's ethnic contemporary wear, single-weave Chanderi, handcrafted Bandhani, and made-to-measure designer blouses. Shipped across India &amp; the United States.
          </p>
          <div class="footer-wa-card">
            <span class="wa-label">WHATSAPP ATELIER CONCIERGE:</span>
            <a href="https://wa.me/918106457406" target="_blank" rel="noopener noreferrer" class="wa-number-link">+91 81064 57406</a>
          </div>
        </div>

        <!-- Col 2: Atelier -->
        <div class="footer-col">
          <h4 class="footer-heading">ATELIER</h4>
          <ul class="footer-links">
            <li><a href="#hero">Home Showcase</a></li>
            <li><a href="#collections">Signature Collections</a></li>
            <li><a href="#shop">Boutique Shop</a></li>
            <li><a href="#custom-stitching">Custom Stitching Studio</a></li>
            <li><a href="#story">Our Craft &amp; Story</a></li>
          </ul>
        </div>

        <!-- Col 3: Client Care -->
        <div class="footer-col">
          <h4 class="footer-heading">CLIENT CARE</h4>
          <ul class="footer-links">
            <li><a href="https://wa.me/918106457406?text=Hello%20Label%20By%20Vinnie%2C%20I%20would%20like%20to%20place%20an%20order%20enquiry." target="_blank" rel="noopener">Order Enquiries</a></li>
            <li><a href="https://wa.me/918106457406?text=Hello%20Label%20By%20Vinnie%2C%20I%20would%20like%20to%20book%20a%20consultation." target="_blank" rel="noopener">WhatsApp Consultation</a></li>
            <li><span style="color:rgba(243,237,225,0.7);">Worldwide Delivery: India &amp; USA</span></li>
            <li><span style="color:rgba(243,237,225,0.7);">Custom Size Alterations</span></li>
          </ul>
        </div>

        <!-- Col 4: Contact -->
        <div class="footer-col" id="footer-contact-col">
          <h4 class="footer-heading">CONTACT</h4>
          <ul class="footer-contact-info">
            <li>
              <strong>Direct WhatsApp:</strong>
              <a href="https://wa.me/918106457406" target="_blank" rel="noopener">+91 81064 57406</a>
            </li>
            <li>
              <strong>Email Inquiries:</strong>
              <a href="mailto:contact@labelbyvinnie.com">contact@labelbyvinnie.com</a>
            </li>
            <li>
              <strong>Official Instagram:</strong>
              <a href="https://www.instagram.com/label_by_vinnie/" target="_blank" rel="noopener">@label_by_vinnie</a>
            </li>
            <li>
              <strong>Atelier Location:</strong>
              <span>Hyderabad, Telangana, India (Worldwide Dispatch)</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom Bar -->
      <div class="footer-bottom-bar">
        <p class="copyright-text">&copy; 2026 LABEL BY VINNIE. All Rights Reserved. Co-founded by Vinnie Vajinepalli.</p>
        <div class="footer-sub-links">
          <a href="https://www.instagram.com/label_by_vinnie/" target="_blank" rel="noopener" class="footer-social-link">Instagram @label_by_vinnie</a>
          <span class="sep">&bull;</span>
          <span>Handcrafted Luxury in India</span>
        </div>
      </div>
    </div>
  </footer>`;

const footerRegex = /<footer id="contact"[\s\S]*?<\/footer>/;
if (html.match(footerRegex)) {
  html = html.replace(footerRegex, properFooter);
  console.log('Restored Luxury Dark Footer with 4 columns and full contrast');
}

fs.writeFileSync('public/index.html', html, 'utf8');

// 5. Update public/script.js to ensure rock-solid video scrubbing and audio
console.log('Updating public/script.js...');
let js = fs.readFileSync('public/script.js', 'utf8');

// Ensure heroVideo metadata handling checks readyState
js = js.replace(
  `if (heroVideo) {\n  heroVideo.addEventListener('loadedmetadata', () => {\n    isVideoReady = true;\n    heroVideo.pause();\n  });\n}`,
  `if (heroVideo) {\n  if (heroVideo.readyState >= 1) {\n    isVideoReady = true;\n  }\n  heroVideo.addEventListener('loadedmetadata', () => {\n    isVideoReady = true;\n    heroVideo.pause();\n  });\n  heroVideo.addEventListener('canplay', () => {\n    isVideoReady = true;\n  });\n}`
);

// Ensure continuous smooth animation loop for video scrubbing
const smoothScrubLoop = `function updateVideoScrub() {
  if (heroVideo && !prefersReducedMotion) {
    if (heroVideo.readyState >= 1) isVideoReady = true;
    if (isVideoReady) {
      const diff = targetVideoTime - heroVideo.currentTime;
      if (Math.abs(diff) > 0.02) {
        heroVideo.currentTime += diff * 0.08;
      }
    }
  }
  requestAnimationFrame(updateVideoScrub);
}
requestAnimationFrame(updateVideoScrub);`;

const currentScrubberRegex = /\/\/ Hero Scrubber State[\s\S]*?isScrubbingActive = false;\s*\}/;
if (js.match(currentScrubberRegex)) {
  js = js.replace(currentScrubberRegex, smoothScrubLoop);
  console.log('Restored continuous smooth hero video scrubbing loop');
}

// Remove lazy video observer that was pausing videos off-screen
js = js.replace('initVideoLazyObserver();', '// initVideoLazyObserver();');

fs.writeFileSync('public/script.js', js, 'utf8');

console.log('--- RESTORATION SCRIPT FINISHED SUCCESSFULLY ---');
