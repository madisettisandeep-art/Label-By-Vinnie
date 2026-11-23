'use client';

import React, { useRef } from 'react';
import { useScrollVideo } from '@/hooks/useScrollVideo';
import { SITE_CONFIG } from '@/config/site';

export function CinematicFashionHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { progress } = useScrollVideo({
    duration: SITE_CONFIG.heroVideo.duration,
    trackRef,
    videoRef,
    lerpFactor: 0.05,
  });

  return (
    <section id="hero" className="relative bg-[#15110D]">
      {/* Pinned 1200vh Scroll Track for slow, ultra-clean cinematic pacing */}
      <div ref={trackRef} className="h-[1200vh] relative">
        <div className="sticky top-0 left-0 w-screen h-screen overflow-hidden">
          
          {/* Master 30s Video */}
          <video
            ref={videoRef}
            src={SITE_CONFIG.heroVideo.src}
            poster={SITE_CONFIG.heroVideo.poster}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
            aria-label="Label By Vinnie 30-Second Cinematic Fashion Film"
          />

          {/* Delicate negligible vertical scroll progress line on right side (No text, no numbers) */}
          <div className="absolute right-5 md:right-7 top-1/2 -translate-y-1/2 w-[1.5px] h-36 bg-warm-ivory/20 rounded-full z-20 overflow-hidden pointer-events-none">
            <div
              className="w-full bg-champagne-gold transition-all duration-75"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
