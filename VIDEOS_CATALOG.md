# Instagram Videos & Reels Catalog - Label By Vinnie

Extracted from Instagram: [@label_by_vinnie](https://www.instagram.com/label_by_vinnie/)  
**Brand:** Label _by_vinnie  
**Total Videos Downloaded:** 10 MP4 Videos & Reels (720p HD with Audio)  
**Location:** [`videos/`](file:///c:/Label%20By%20Vinnie/videos/)  
**Structured Metadata:** [`videos_inventory.json`](file:///c:/Label%20By%20Vinnie/videos_inventory.json)  

---

## 🎬 Video & Reel Inventory Overview

| # | Filename | Size | Product / Outfit Title | Instagram Reel Link |
|---|---|---|---|---|
| **01** | [`01_a_beautiful_bandhani_a_line_ku_DfWb-hVttke.mp4`](file:///c:/Label%20By%20Vinnie/videos/01_a_beautiful_bandhani_a_line_ku_DfWb-hVttke.mp4) | **1.93 MB** | Bandhani A-Line Kurta & Dupatta Set | [Watch on Instagram](https://www.instagram.com/reel/DfWb-hVttke/) |
| **02** | [`02_wrapped_in_tradition_styled_wi_DdYUOM_N9YX.mp4`](file:///c:/Label%20By%20Vinnie/videos/02_wrapped_in_tradition_styled_wi_DdYUOM_N9YX.mp4) | **5.84 MB** | Bandhani Love Festive Ensemble | [Watch on Instagram](https://www.instagram.com/reel/DdYUOM_N9YX/) |
| **03** | [`03_a_quiet_glow_of_bhandini_woven_DTzLQgDiZ0B.mp4`](file:///c:/Label%20By%20Vinnie/videos/03_a_quiet_glow_of_bhandini_woven_DTzLQgDiZ0B.mp4) | **3.43 MB** | Pista Green Bhandini Woven 3-Piece Set | [Watch on Instagram](https://www.instagram.com/reel/DTzLQgDiZ0B/) |
| **04** | [`04_blouse_customisation_available_Df6R-HFtvFo.mp4`](file:///c:/Label%20By%20Vinnie/videos/04_blouse_customisation_available_Df6R-HFtvFo.mp4) | **0.54 MB** | Bespoke Blouse Customisation Showcase | [Watch on Instagram](https://www.instagram.com/reel/Df6R-HFtvFo/) |
| **05** | [`05_a_beautiful_navy_blue_designer_DfohqqltYqh.mp4`](file:///c:/Label%20By%20Vinnie/videos/05_a_beautiful_navy_blue_designer_DfohqqltYqh.mp4) | **3.97 MB** | Navy Blue Designer Blouse with Gold Zari Border | [Watch on Instagram](https://www.instagram.com/reel/DfohqqltYqh/) |
| **06** | [`06_label_by_vinnie_fav_picks_DfkIEygNh2_.mp4`](file:///c:/Label%20By%20Vinnie/videos/06_label_by_vinnie_fav_picks_DfkIEygNh2_.mp4) | **7.35 MB** | Label By Vinnie Favorite Picks Collection | [Watch on Instagram](https://www.instagram.com/reel/DfkIEygNh2_/) |
| **07** | [`07_elegance_in_every_detail_DfXfzskzB_j.mp4`](file:///c:/Label%20By%20Vinnie/videos/07_elegance_in_every_detail_DfXfzskzB_j.mp4) | **5.59 MB** | Elegance in Every Detail Golden Ensemble | [Watch on Instagram](https://www.instagram.com/reel/DfXfzskzB_j/) |
| **08** | [`09_chanderi_zari_booti_top_DfEtSH3NdhZ.mp4`](file:///c:/Label%20By%20Vinnie/videos/09_chanderi_zari_booti_top_DfEtSH3NdhZ.mp4) | **2.10 MB** | Chanderi Zari Booti Suit Set (Top, Dupatta & Bottom) | [Watch on Instagram](https://www.instagram.com/reel/DfEtSH3NdhZ/) |
| **09** | [`11_exclusive_banarasi_chanderi_co_DdsugmFtGR5.mp4`](file:///c:/Label%20By%20Vinnie/videos/11_exclusive_banarasi_chanderi_co_DdsugmFtGR5.mp4) | **1.89 MB** | Exclusive Banarasi Chanderi Mirror Work Collection | [Watch on Instagram](https://www.instagram.com/reel/DdsugmFtGR5/) |
| **10** | [`12_where_tradition_meets_contempo_DdBXuWGt0R3.mp4`](file:///c:/Label%20By%20Vinnie/videos/12_where_tradition_meets_contempo_DdBXuWGt0R3.mp4) | **5.66 MB** | Customised Kolam-Inspired Fusion Outfit | [Watch on Instagram](https://www.instagram.com/reel/DdBXuWGt0R3/) |

---

## 💻 How to Use in Your Application

### HTML5 `<video>` Tag with Autoplay & Loop
```html
<video 
  src="/videos/01_a_beautiful_bandhani_a_line_ku_DfWb-hVttke.mp4" 
  autoplay 
  muted 
  loop 
  playsinline 
  class="w-full rounded-lg shadow-lg">
</video>
```

### In React / Next.js
```tsx
import videos from './videos_inventory.json';

export default function ReelGallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((reel) => (
        <div key={reel.post_code} className="rounded-xl overflow-hidden shadow-lg bg-black">
          <video
            src={`/videos/${reel.filename}`}
            controls
            playsInline
            preload="metadata"
            className="w-full aspect-[9/16] object-cover"
          />
          <div className="p-4 bg-white">
            <h4 className="font-serif font-bold text-lg">{reel.title}</h4>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{reel.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```
