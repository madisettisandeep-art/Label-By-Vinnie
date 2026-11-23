'use client';

import React, { useState, useRef } from 'react';
import { SITE_CONFIG } from '@/config/site';

const REELS = [
  {
    video: '/videos/01_a_beautiful_bandhani_a_line_ku_DfWb-hVttke.mp4',
    url: 'https://www.instagram.com/reel/DfWb-hVttke/',
    label: 'Bandhani A-Line Kurta Edit',
  },
  {
    video: '/videos/07_elegance_in_every_detail_DfXfzskzB_j.mp4',
    url: 'https://www.instagram.com/reel/DfXfzskzB_j/',
    label: 'Bespoke Navy Blouse Detail',
  },
  {
    video: '/videos/03_a_quiet_glow_of_bhandini_woven_DTzLQgDiZ0B.mp4',
    url: 'https://www.instagram.com/reel/DTzLQgDiZ0B/',
    label: 'Pista Green Bandhani Glow',
  },
  {
    video: '/videos/02_wrapped_in_tradition_styled_wi_DdYUOM_N9YX.mp4',
    url: 'https://www.instagram.com/reel/DdYUOM_N9YX/',
    label: 'Wrapped in Tradition Edit',
  },
  {
    video: '/videos/09_chanderi_zari_booti_top_DfEtSH3NdhZ.mp4',
    url: 'https://www.instagram.com/reel/DfEtSH3NdhZ/',
    label: 'Chanderi Zari Booti Ensemble',
  },
  {
    video: '/videos/11_exclusive_banarasi_chanderi_co_DdsugmFtGR5.mp4',
    url: 'https://www.instagram.com/reel/DdsugmFtGR5/',
    label: 'Banarasi Mirrored Weave',
  },
  {
    video: '/videos/12_where_tradition_meets_contempo_DdBXuWGt0R3.mp4',
    url: 'https://www.instagram.com/reel/DdBXuWGt0R3/',
    label: 'Contemporary Fusion Gown',
  },
  {
    video: '/videos/05_a_beautiful_navy_blue_designer_DfohqqltYqh.mp4',
    url: 'https://www.instagram.com/reel/DfohqqltYqh/',
    label: 'Potli Sleeve Designer Blouse',
  },
];

export function InstagramSection() {
  const [activeMuted, setActiveMuted] = useState<number | null>(null);
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [volumes, setVolumes] = useState<{ [key: number]: number }>({
    0: 0.8, 1: 0.8, 2: 0.8, 3: 0.8, 4: 0.8, 5: 0.8, 6: 0.8, 7: 0.8
  });
  const [feedback, setFeedback] = useState<{ index: number; text: string } | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const toggleAudio = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (activeMuted === index) {
      video.muted = true;
      setActiveMuted(null);
      setActivePanel(null);
      setFeedback({ index, text: 'Muted 🔇' });
    } else {
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) {
          v.muted = true;
        }
      });
      video.muted = false;
      video.volume = volumes[index] ?? 0.8;
      video.play().catch(() => {});
      setActiveMuted(index);
      setActivePanel(index);
      setFeedback({ index, text: 'Volume Active 🔊' });
    }

    setTimeout(() => setFeedback(null), 1800);
  };

  const handleVolumeChange = (index: number, val: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.volume = val;
      if (val === 0) {
        video.muted = true;
        setActiveMuted(null);
      } else {
        video.muted = false;
        setActiveMuted(index);
      }
    }
    setVolumes(prev => ({ ...prev, [index]: val }));
  };

  return (
    <section className="py-24 bg-soft-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
        <div className="inline-flex items-center gap-2 text-xs tracking-luxury text-antique-brown uppercase font-semibold mb-3">
          <svg className="w-4 h-4 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          <span>@Follow Us On</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-espresso font-normal mb-3">
          {SITE_CONFIG.instagramHandle.toUpperCase()}
        </h2>
        <p className="text-sm text-taupe max-w-md mx-auto mb-12">
          Discover real client ensembles, boutique packaging stories, and seasonal launches on our official Instagram.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REELS.map((reel, idx) => (
            <div
              key={idx}
              className="group relative h-[330px] overflow-hidden rounded-md bg-black shadow-md hover:-translate-y-1 transition-all duration-300"
              onMouseLeave={() => setActivePanel(null)}
            >
              <video
                ref={(el) => { videoRefs.current[idx] = el; }}
                src={reel.video}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />

              {/* Sound Control Group with Volume Slider Bar */}
              <div className="absolute top-3 right-3 z-25 flex items-center gap-2">
                {activePanel === idx && (
                  <div className="flex items-center gap-1.5 bg-[#140d09]/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-champagne-gold/50 shadow-xl">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volumes[idx] ?? 0.8}
                      onChange={(e) => handleVolumeChange(idx, parseFloat(e.target.value))}
                      className="w-16 h-1 accent-champagne-gold cursor-pointer"
                      aria-label="Volume Slider"
                    />
                    <span className="text-[10px] text-champagne-gold font-mono font-semibold">
                      {Math.round((volumes[idx] ?? 0.8) * 100)}%
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudio(idx);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all shadow-lg ${
                    activeMuted === idx
                      ? 'bg-espresso/90 text-champagne-gold border-champagne-gold shadow-[0_0_14px_rgba(255,215,0,0.5)] scale-105'
                      : 'bg-espresso/80 text-soft-ivory/80 border-soft-ivory/30 hover:scale-110 hover:border-champagne-gold'
                  }`}
                  title={activeMuted === idx ? 'Tap to mute / adjust' : 'Tap for volume'}
                >
                  {activeMuted === idx ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Toast Feedback */}
              {feedback && feedback.index === idx && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-espresso/90 text-soft-ivory text-xs px-4 py-2 rounded-full border border-champagne-gold/40 shadow-xl pointer-events-none animate-fade-in">
                  {feedback.text}
                </div>
              )}

              {/* Hover Overlay with Open on Instagram Link */}
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-[#15110D]/65 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-soft-ivory z-10"
              >
                <div className="inline-flex items-center gap-2 bg-espresso border border-champagne-gold text-soft-ivory px-4 py-2 text-xs tracking-luxury uppercase font-semibold hover:bg-champagne-gold hover:text-espresso transition-all shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>OPEN ON INSTAGRAM &nearr;</span>
                </div>
                <p className="font-serif text-base mt-3 text-warm-ivory">{reel.label}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
              </a>

              <span className="absolute bottom-3 left-3 z-10 bg-espresso/85 text-soft-ivory text-[0.58rem] tracking-luxury uppercase px-2.5 py-1 font-semibold border-l-2 border-champagne-gold">
                REEL
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
