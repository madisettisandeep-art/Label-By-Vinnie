'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { COLLECTIONS } from '@/services/productService';

export function CollectionsSection() {
  // Duplicate collections to create seamless infinite loop
  const duplicatedCollections = [...COLLECTIONS, ...COLLECTIONS];

  return (
    <section id="collections" className="py-16 bg-soft-ivory overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl text-espresso font-normal mb-3">
            EXPLORE OUR COLLECTIONS
          </h2>
          <div className="w-16 h-[2px] bg-champagne-gold mx-auto" />
        </div>
      </div>

      {/* Infinite Scrolling Ribbon (Right to Left with Hover-to-Pause, Clean edge to edge) */}
      <div className="relative w-full overflow-hidden py-2 group">
        <div className="flex w-max gap-5 animate-marquee-left group-hover:[animation-play-state:paused] will-change-transform">
          {duplicatedCollections.map((col, idx) => (
            <Link
              key={`${col.id}-${idx}`}
              href={`#shop`}
              onClick={(e) => {
                const shopEl = document.getElementById('shop');
                if (shopEl) {
                  e.preventDefault();
                  shopEl.scrollIntoView({ behavior: 'smooth' });
                  window.dispatchEvent(new CustomEvent('lbv-select-category', { detail: col.slug }));
                }
              }}
              className="relative w-[260px] h-[360px] shrink-0 overflow-hidden block rounded-md shadow-md border border-champagne-gold/20 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl hover:border-champagne-gold/70 bg-[#1a1612]"
            >
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15110D]/95 via-[#15110D]/40 to-transparent flex flex-col justify-end p-5 text-soft-ivory">
                <span className="text-[0.68rem] tracking-luxury text-champagne-gold font-semibold mb-1">
                  {col.number}
                </span>
                <h3 className="font-serif text-lg tracking-wide uppercase mb-1">
                  {col.title}
                </h3>
                <p className="text-xs text-warm-ivory/80 line-clamp-2 leading-relaxed mb-3">
                  {col.description}
                </p>
                <span className="text-[0.68rem] tracking-widest text-champagne-gold uppercase font-semibold inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
                  View Collection &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
