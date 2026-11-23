'use client';

import React from 'react';
import Link from 'next/link';

interface HeroStoryStagesProps {
  currentStage: 1 | 2 | 3;
}

export function HeroStoryStages({ currentStage }: HeroStoryStagesProps) {
  return (
    <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col justify-center pointer-events-none">
      
      {/* Top persistent eyebrow label */}
      <div className="absolute top-28 md:top-36 left-6 md:left-12 flex items-center gap-2.5 text-[0.72rem] tracking-luxury text-champagne-gold uppercase font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold"></span>
        <span>AUTUMN / WINTER COUTURE EDIT</span>
      </div>

      {/* STAGE 01: THE ENTRY & DISCOVERY (00:00–00:10) */}
      <div
        className={`absolute max-w-xl transition-all duration-700 ease-out ${
          currentStage === 1
            ? 'opacity-100 translate-y-0 filter-none pointer-events-auto'
            : 'opacity-0 translate-y-6 blur-sm pointer-events-none'
        }`}
      >
        <span className="font-serif text-2xl text-champagne-gold block mb-2 font-normal">01</span>
        <p className="text-[0.78rem] tracking-luxury uppercase text-champagne-gold mb-3 font-semibold">
          THE ART OF STYLE
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.08] text-soft-ivory mb-6 font-normal drop-shadow-lg">
          Discover a World<br />
          <em className="italic text-champagne-beige">of Elegance.</em>
        </h1>
        <p className="text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed max-w-lg">
          Where handpicked weaves meet modern grace. Every thread celebrates timeless Indian craftsmanship and personal expression.
        </p>
      </div>

      {/* STAGE 02: THE TRANSFORMATIONS (00:10–00:20) */}
      <div
        className={`absolute max-w-xl transition-all duration-700 ease-out ${
          currentStage === 2
            ? 'opacity-100 translate-y-0 filter-none pointer-events-auto'
            : 'opacity-0 translate-y-6 blur-sm pointer-events-none'
        }`}
      >
        <span className="font-serif text-2xl text-champagne-gold block mb-2 font-normal">02</span>
        <p className="text-[0.78rem] tracking-luxury uppercase text-champagne-gold mb-3 font-semibold">
          ENDLESS EXPRESSIONS
        </p>
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.08] text-soft-ivory mb-6 font-normal drop-shadow-lg">
          Ethnic. Western.<br />
          <em className="italic text-champagne-beige">Contemporary. Couture.</em>
        </h2>
        <p className="text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed max-w-lg">
          Delicate zari booti, handcrafted Bandhani, and bespoke designer cuts tailored for your unique persona.
        </p>
      </div>

      {/* STAGE 03: THE GRAND REVEAL (00:20–00:30) */}
      <div
        className={`absolute max-w-2xl transition-all duration-700 ease-out ${
          currentStage === 3
            ? 'opacity-100 translate-y-0 filter-none pointer-events-auto'
            : 'opacity-0 translate-y-6 blur-sm pointer-events-none'
        }`}
      >
        <p className="text-sm tracking-luxury uppercase text-champagne-gold mb-3 font-semibold">
          LABEL BY VINNIE
        </p>
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-soft-ivory mb-4 font-normal drop-shadow-2xl">
          Welcome to the World<br />
          <em className="italic text-champagne-beige">Of Label By Vinnie</em>
        </h2>
        <p className="font-serif text-lg sm:text-xl text-champagne-beige tracking-wider mb-6">
          UNLIMITED FASHION CHOICES &bull; Timeless Heritage &bull; Modern Couture
        </p>
        <div className="flex flex-wrap gap-4 pointer-events-auto">
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-antique-brown text-soft-ivory border border-antique-brown text-xs font-semibold tracking-luxury uppercase transition-all duration-300 hover:bg-espresso hover:border-espresso hover:-translate-y-0.5 shadow-xl"
          >
            SHOP COLLECTION
          </Link>
          <Link
            href="/custom-stitching"
            className="px-8 py-3.5 bg-transparent text-soft-ivory border border-warm-ivory/40 text-xs font-semibold tracking-luxury uppercase transition-all duration-300 hover:bg-soft-ivory hover:text-espresso hover:-translate-y-0.5"
          >
            CUSTOM STITCHING
          </Link>
        </div>
      </div>

      {/* Persistent Logo Badge covering Google Flow Watermark throughout entire Hero animation */}
      <div className="fixed bottom-0 right-0 z-35 flex items-center gap-3 bg-[#140d09] px-6 py-2.5 rounded-tl-2xl border-t border-l border-champagne-gold/60 shadow-2xl pointer-events-none min-w-[220px]">
        <img
          src="/assets/brand/logo.jpg"
          alt="Label By Vinnie Logo"
          className="w-8 h-8 rounded-full object-cover border border-champagne-gold"
        />
        <span className="text-[0.68rem] tracking-luxury uppercase text-soft-ivory font-semibold">
          LABEL BY VINNIE
        </span>
      </div>
    </div>
  );
}
