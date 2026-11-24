'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroBanner } from '@/types';
import { getActiveBanners } from '@/services/bannerService';

export function CampaignHeroCarousel() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Load banners and listen for admin updates
  const loadBanners = useCallback(() => {
    const active = getActiveBanners();
    setBanners(active);
  }, []);

  useEffect(() => {
    loadBanners();

    const handleUpdate = () => loadBanners();
    window.addEventListener('lbv-banners-updated', handleUpdate);

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', motionHandler);

    return () => {
      window.removeEventListener('lbv-banners-updated', handleUpdate);
      mql.removeEventListener('change', motionHandler);
    };
  }, [loadBanners]);

  const bannerCount = banners.length;

  // Navigation handlers
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || bannerCount <= 1) return;
      setIsTransitioning(true);
      setCurrentIndex((index + bannerCount) % bannerCount);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [bannerCount, isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Autoplay timer (5 seconds) with pause on hover & reduced-motion check
  useEffect(() => {
    if (bannerCount <= 1 || isHovered || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [bannerCount, currentIndex, isHovered, nextSlide, prefersReducedMotion]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const minSwipeDistance = 45;
    if (touchDeltaX < -minSwipeDistance) {
      nextSlide();
    } else if (touchDeltaX > minSwipeDistance) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  if (banners.length === 0) {
    return (
      <section className="w-full bg-[#15110D] aspect-[2.4/1] min-h-[460px] flex items-center justify-center text-soft-ivory">
        <div className="w-8 h-8 rounded-full border-2 border-champagne-gold border-t-transparent animate-spin" />
      </section>
    );
  }

  return (
    <section
      ref={carouselRef}
      id="hero"
      aria-label="Fashion Campaigns"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden bg-[#140D09] select-none outline-none focus-visible:ring-2 focus-visible:ring-champagne-gold/60"
    >
      {/* 
        Full Viewport Width Hero Container
        Desktop aspect ratio ~ 2.4:1 with responsive clamps for mobile & tablet
      */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2.4/1] min-h-[420px] sm:min-h-[520px] md:min-h-[600px] lg:min-h-[660px] max-h-[820px]">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          const isPrior =
            index === (currentIndex - 1 + bannerCount) % bannerCount;

          return (
            <div
              key={banner.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 z-10 pointer-events-auto'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Campaign Poster Artwork */}
              <Link
                href={banner.destination_url || '/#shop'}
                className="relative block w-full h-full overflow-hidden group/slide cursor-pointer"
                title={`${banner.title} — ${banner.subtitle}`}
              >
                <Image
                  src={banner.desktop_image_url}
                  alt={`${banner.title} — Label By Vinnie Luxury Indian Ethnic Wear`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center transition-transform duration-[1800ms] ease-out group-hover/slide:scale-[1.02]"
                />

                {/* Subtle luxury edge vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                {/* Hidden accessible text for screen readers and SEO */}
                <span className="sr-only">
                  {banner.title}: {banner.subtitle}. {banner.cta_text}.
                </span>
              </Link>
            </div>
          );
        })}

        {/* Previous Navigation Arrow */}
        {bannerCount > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous campaign banner"
            className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#140D09]/60 hover:bg-antique-brown border border-champagne-gold/40 hover:border-champagne-gold text-soft-ivory flex items-center justify-center backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group/arrow"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover/arrow:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Next Navigation Arrow */}
        {bannerCount > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next campaign banner"
            className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#140D09]/60 hover:bg-antique-brown border border-champagne-gold/40 hover:border-champagne-gold text-soft-ivory flex items-center justify-center backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group/arrow"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover/arrow:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Slide Indicators: Small elegant progress bars */}
        {bannerCount > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-[#140D09]/55 backdrop-blur-md border border-champagne-gold/25 shadow-lg">
            {banners.map((banner, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={banner.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  aria-label={`Go to slide ${index + 1}: ${banner.title}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isActive
                      ? 'w-7 sm:w-9 bg-champagne-gold shadow-[0_0_8px_rgba(197,160,89,0.7)]'
                      : 'w-2 sm:w-2.5 bg-soft-ivory/40 hover:bg-soft-ivory/70'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}