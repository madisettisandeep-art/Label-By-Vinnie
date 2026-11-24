'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollVideo } from '@/hooks/useScrollVideo';
import { BrandWatermarkOverlay } from './BrandWatermarkOverlay';
import { SITE_CONFIG } from '@/config/site';

export function CinematicFashionHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { progress, currentStage, hasError } = useScrollVideo({
    duration: SITE_CONFIG.heroVideo.duration,
    trackRef,
    videoRef,
    lerpFactor: 0.28,
  });

  return (
    <section id="hero" className="relative bg-[#15110D] overflow-hidden">
      {/* Pinned 1200vh Scroll Track for slow, ultra-clean cinematic pacing */}
      <div ref={trackRef} className="h-[1200vh] relative">
        <div
          ref={containerRef}
          className="sticky top-0 left-0 w-full h-[100vh] h-[100dvh] overflow-hidden bg-[#140D09]"
        >
          {/* Master 30s Video */}
          {!hasError ? (
            <video
              ref={videoRef}
              src={SITE_CONFIG.heroVideo.src}
              poster={SITE_CONFIG.heroVideo.poster}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
              aria-label="Label By Vinnie 30-Second Cinematic Fashion Film"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src={SITE_CONFIG.heroVideo.poster}
                alt="Label By Vinnie Luxury Collection"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          )}

          {/* Delicate Top Autumn/Winter Eyebrow Pill */}
          <div className="absolute top-24 md:top-28 left-6 md:left-12 z-20 flex items-center gap-2.5 text-[0.68rem] tracking-luxury text-champagne-gold uppercase font-medium pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold animate-pulse" />
            <span>AUTUMN / WINTER COUTURE EDIT</span>
          </div>

          {/* STAGE 01: THE ENTRY & DISCOVERY (Progress 0.0 - 0.35) */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-6 md:left-14 max-w-xl z-20 transition-all duration-700 ease-out pointer-events-none ${
              currentStage === 1 && progress < 0.35
                ? 'opacity-100 translate-y-[-50%] filter-none'
                : 'opacity-0 translate-y-[-45%] blur-sm'
            }`}
          >
            <span className="font-serif text-2xl text-champagne-gold block mb-1 font-normal">01</span>
            <p className="text-[0.72rem] tracking-luxury uppercase text-champagne-gold mb-2 font-semibold">
              THE ART OF STYLE
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl leading-[1.1] text-soft-ivory mb-4 font-normal drop-shadow-lg">
              Discover a World<br />
              <em className="italic text-champagne-beige">of Elegance.</em>
            </h1>
            <p className="text-xs sm:text-base text-warm-ivory/80 font-light leading-relaxed max-w-md hidden sm:block">
              Where handpicked weaves meet modern grace. Every thread celebrates timeless Indian craftsmanship and personal expression.
            </p>
          </div>

          {/* STAGE 02: THE TRANSFORMATIONS (Progress 0.35 - 0.70) */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-6 md:left-14 max-w-xl z-20 transition-all duration-700 ease-out pointer-events-none ${
              currentStage === 2 && progress >= 0.35 && progress < 0.70
                ? 'opacity-100 translate-y-[-50%] filter-none'
                : 'opacity-0 translate-y-[-45%] blur-sm'
            }`}
          >
            <span className="font-serif text-2xl text-champagne-gold block mb-1 font-normal">02</span>
            <p className="text-[0.72rem] tracking-luxury uppercase text-champagne-gold mb-2 font-semibold">
              ENDLESS EXPRESSIONS
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl leading-[1.1] text-soft-ivory mb-4 font-normal drop-shadow-lg">
              Ethnic. Western.<br />
              <em className="italic text-champagne-beige">Contemporary. Couture.</em>
            </h2>
            <p className="text-xs sm:text-base text-warm-ivory/80 font-light leading-relaxed max-w-md hidden sm:block">
              Delicate zari booti, handcrafted Bandhani, and bespoke designer cuts tailored for your unique persona.
            </p>
          </div>

          {/* STAGE 03: END-OF-SCROLL GRAND WELCOME OVERLAY (Progress >= 0.72) */}
          <div
            className={`absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 transition-all duration-700 ease-out pointer-events-none ${
              progress >= 0.72
                ? 'opacity-100 scale-100 filter-none pointer-events-auto'
                : 'opacity-0 scale-95 blur-sm pointer-events-none'
            }`}
          >
            <div className="w-full max-w-lg bg-[#140D09]/92 backdrop-blur-md border border-champagne-gold/60 p-7 sm:p-10 rounded-sm shadow-2xl text-center text-soft-ivory">
              <span className="block text-[0.72rem] tracking-[0.25em] text-champagne-gold font-semibold uppercase mb-3">
                UNLIMITED FASHION CHOICES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight mb-3">
                Welcome to the World Of<br />
                <span className="text-champagne-gold font-normal">Label By Vinnie</span>
              </h2>
              <p className="text-xs sm:text-sm text-warm-ivory/80 font-light leading-relaxed mb-6">
                Authentic Banarasi Chanderi &bull; Handloom Bandhani &bull; Bespoke Tailoring
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  href="/#collections"
                  onClick={(e) => {
                    const colEl = document.getElementById('collections');
                    if (colEl) {
                      e.preventDefault();
                      colEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-champagne-gold to-[#a9813b] text-[#140D09] text-xs font-semibold tracking-luxury uppercase rounded-sm shadow-lg hover:brightness-110 transition-all text-center"
                >
                  BEST SELLERS &darr;
                </Link>
                <Link
                  href="/custom-stitching"
                  className="w-full sm:w-auto px-7 py-3 bg-transparent border border-champagne-gold/50 text-soft-ivory text-xs font-semibold tracking-luxury uppercase rounded-sm hover:bg-champagne-gold/15 transition-all text-center"
                >
                  CUSTOM STITCHING
                </Link>
              </div>
            </div>
          </div>

          {/* Delicate vertical scroll progress indicator on right side */}
          <div className="absolute right-4 sm:right-7 top-1/2 -translate-y-1/2 w-[1.5px] h-32 sm:h-36 bg-warm-ivory/20 rounded-full z-20 overflow-hidden pointer-events-none">
            <div
              className="w-full bg-champagne-gold transition-all duration-75"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          {/* 
            Brand Watermark Logo Overlay:
            Anchored to the video's coordinate system, precisely covering the Google Flow watermark
            throughout the entire animation from frame 00:00 to 00:30 on every screen size.
          */}
          <BrandWatermarkOverlay
            containerRef={containerRef}
            videoRef={videoRef}
            videoAspectRatio={16 / 9}
          />
        </div>
      </div>
    </section>
  );
}