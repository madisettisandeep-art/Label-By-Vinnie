'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const STORY_DRESSES = [
  {
    src: '/assets/fabrics/chanderi-zari-weave-texture.jpg',
    alt: 'Banarasi Chanderi Zari Suit - Crimson Red',
    badge: 'BANARASI CHANDERI • CRIMSON RED',
  },
  {
    src: '/assets/story/01_red_bandhani_anarkali.jpg',
    alt: 'Handloom Bandhani Anarkali with Potli Detailing',
    badge: 'HANDLOOM BANDHANI • ANARKALI',
  },
  {
    src: '/assets/story/02_pista_green_bandhani_set.jpg',
    alt: 'Pista Green Bandhani Peplum Ensemble',
    badge: 'BANDHANI SILK • PISTA GREEN',
  },
  {
    src: '/assets/story/03_magenta_chanderi_zari_suit.jpg',
    alt: 'Banarasi Chanderi Zari Suit - Rani Pink',
    badge: 'BANARASI CHANDERI • RANI PINK',
  },
  {
    src: '/assets/story/04_mehndi_green_chanderi_zari_suit.jpg',
    alt: 'Banarasi Chanderi Zari Suit - Mehndi Green',
    badge: 'BANARASI CHANDERI • MEHNDI GREEN',
  },
  {
    src: '/assets/story/05_rust_orange_chanderi_zari_suit.jpg',
    alt: 'Banarasi Chanderi Zari Suit - Rust Terracotta',
    badge: 'BANARASI CHANDERI • RUST ORANGE',
  },
  {
    src: '/assets/story/06_royal_purple_chanderi_zari_suit.jpg',
    alt: 'Banarasi Chanderi Zari Suit - Royal Purple',
    badge: 'BANARASI CHANDERI • ROYAL PURPLE',
  },
];

export function BrandStory() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STORY_DRESSES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section id="story" className="py-28 bg-warm-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Visual Composition */}
          <div className="relative">
            {/* Confined Slideshow Box (strictly overflow-hidden) */}
            <div
              className="relative w-[85%] h-[580px] overflow-hidden shadow-2xl rounded bg-espresso group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slides Track */}
              <div
                className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {STORY_DRESSES.map((dress, idx) => (
                  <div key={idx} className="relative w-full h-full flex-shrink-0">
                    <Image
                      src={dress.src}
                      alt={dress.alt}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                    <span className="absolute bottom-5 left-5 z-10 bg-espresso/85 text-soft-ivory text-[0.62rem] tracking-luxury uppercase px-3.5 py-1.5 font-semibold border-l-2 border-champagne-gold shadow-lg backdrop-blur-sm">
                      {dress.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* Slide Counter & Dots */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2.5 bg-espresso/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-champagne-gold/30">
                <span className="text-[0.65rem] tracking-luxury text-soft-ivory font-semibold">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(STORY_DRESSES.length).padStart(2, '0')}
                </span>
                <div className="flex gap-1.5 items-center">
                  {STORY_DRESSES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 transition-all rounded-full ${
                        idx === currentIndex
                          ? 'w-4 bg-champagne-gold'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 right-0 w-[48%] h-[280px] overflow-hidden border-8 border-warm-ivory shadow-xl z-10 bg-warm-ivory/50 flex items-center justify-center p-6">
              <div className="relative w-full h-full">
                <Image
                  src="/assets/brand/logo.jpg"
                  alt="Label By Vinnie Official Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <span className="text-xs tracking-luxury text-antique-brown uppercase font-semibold block mb-3">
              THE ESSENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-espresso font-normal leading-tight mb-6">
              THE STORY BEHIND EVERY STYLE
            </h2>
            <p className="font-serif text-xl sm:text-2xl text-espresso leading-relaxed mb-6 font-normal">
              LABEL BY VINNIE celebrates individuality, creativity, and the enduring beauty of personal expression.
            </p>
            <p className="text-base text-taupe leading-relaxed mb-4">
              Co-founded by Vinnie Vajinepalli, our atelier bridges royal Indian handloom traditions—from the delicate sheen of Banarasi Chanderi to intricate Bandhani tie-dye—with modern silhouettes.
            </p>
            <p className="text-base text-taupe leading-relaxed mb-8">
              We believe couture is not merely worn; it is an intimate expression of identity. Every ensemble is created with premium fabrics, conscientious artisanal finishing, and personal styling consultations for every customer.
            </p>

            {/* Brand Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-taupe/20">
              <div>
                <span className="font-serif text-lg text-champagne-gold font-bold">01</span>
                <h4 className="font-serif text-base text-espresso font-semibold mb-1">Curated Collections</h4>
                <p className="text-xs text-taupe leading-relaxed">Thoughtfully presented styles for celebratory occasions and festivals.</p>
              </div>
              <div>
                <span className="font-serif text-lg text-champagne-gold font-bold">02</span>
                <h4 className="font-serif text-base text-espresso font-semibold mb-1">Custom Stitching</h4>
                <p className="text-xs text-taupe leading-relaxed">Tailored precisely to your silhouette, neckline, and drape preferences.</p>
              </div>
              <div>
                <span className="font-serif text-lg text-champagne-gold font-bold">03</span>
                <h4 className="font-serif text-base text-espresso font-semibold mb-1">Personal Attention</h4>
                <p className="text-xs text-taupe leading-relaxed">Direct WhatsApp styling guidance and customized care.</p>
              </div>
              <div>
                <span className="font-serif text-lg text-champagne-gold font-bold">04</span>
                <h4 className="font-serif text-base text-espresso font-semibold mb-1">Worldwide Shipping</h4>
                <p className="text-xs text-taupe leading-relaxed">Carefully packed in signature boxes and dispatched to India &amp; USA.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
