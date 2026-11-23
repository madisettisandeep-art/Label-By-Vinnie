'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { SITE_CONFIG } from '@/config/site';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        if (rect.bottom <= 80) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      } else if (window.scrollY > 400) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-warm-ivory/95 backdrop-blur-md py-3.5 border-b border-taupe/20 text-espresso shadow-sm'
            : 'bg-transparent py-6 text-soft-ivory drop-shadow-md'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo Badge (Brand text removed for perfectly balanced, even nav spacing) */}
          <Link href="/" className="flex items-center group" aria-label="Label By Vinnie">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-champagne-gold shadow-sm">
              <Image
                src="/assets/brand/logo.jpg"
                alt="Label By Vinnie"
                width={44}
                height={44}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-9">
            {SITE_CONFIG.navLinks.map((item) => {
              if (item.label === 'Shop By Collection') {
                return (
                  <div key={item.label} className="relative group/coll">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-[0.82rem] tracking-widest uppercase font-medium transition-colors duration-300 hover:text-champagne-gold"
                    >
                      <span>{item.label}</span>
                      <svg className="w-3 h-3 transition-transform duration-300 group-hover/coll:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <div className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-64 bg-[#140d09]/95 backdrop-blur-md border border-champagne-gold/45 rounded shadow-2xl p-2.5 opacity-0 invisible pointer-events-none group-hover/coll:opacity-100 group-hover/coll:visible group-hover/coll:pointer-events-auto transition-all duration-200 z-50">
                      <div className="text-[10px] tracking-[0.16em] uppercase font-bold text-champagne-gold px-3 py-1.5 border-b border-champagne-gold/25">
                        SELECT COLLECTION
                      </div>
                      <Link href="/#collections" className="flex items-center justify-between px-3 py-2 text-xs text-soft-ivory hover:text-champagne-gold hover:bg-champagne-gold/15 rounded transition-all">
                        <span>All Collections</span>
                        <span className="text-[9px] bg-antique-brown text-soft-ivory px-1.5 py-0.5 rounded-full">Explore</span>
                      </Link>
                      <Link href="/#shop" className="block px-3 py-2 text-xs text-soft-ivory hover:text-champagne-gold hover:bg-champagne-gold/15 rounded transition-all">
                        Blouses &amp; Designer Cuts
                      </Link>
                      <Link href="/#shop" className="block px-3 py-2 text-xs text-soft-ivory hover:text-champagne-gold hover:bg-champagne-gold/15 rounded transition-all">
                        Handloom Bandhani &amp; Sarees
                      </Link>
                      <Link href="/#shop" className="block px-3 py-2 text-xs text-soft-ivory hover:text-champagne-gold hover:bg-champagne-gold/15 rounded transition-all">
                        Banarasi &amp; Chanderi Suits
                      </Link>
                      <Link href="/#shop" className="block px-3 py-2 text-xs text-soft-ivory hover:text-champagne-gold hover:bg-champagne-gold/15 rounded transition-all">
                        Co-ord Sets &amp; 3-Piece
                      </Link>
                      <Link href="/#shop" className="block px-3 py-2 text-xs text-soft-ivory hover:text-champagne-gold hover:bg-champagne-gold/15 rounded transition-all">
                        Everyday &amp; Fusion Wear
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[0.82rem] tracking-widest uppercase font-medium transition-colors duration-300 hover:text-champagne-gold"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/label_by_vinnie/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 transition-transform duration-200 hover:-translate-y-0.5 hover:text-[#E1306C]"
              aria-label="Follow Label By Vinnie on Instagram"
              title="Follow @label_by_vinnie on Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 transition-transform duration-200 hover:-translate-y-0.5 hover:text-champagne-gold"
              aria-label="Open Shopping Bag"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-antique-brown text-soft-ivory text-[0.62rem] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 flex flex-col gap-1.5"
              aria-label="Toggle Navigation Drawer"
            >
              <span className="w-6 h-[2px] bg-current"></span>
              <span className="w-6 h-[2px] bg-current"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-warm-ivory z-[2000] p-8 shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex justify-between items-center pb-6 border-b border-taupe/20">
            <span className="text-xs tracking-luxury text-antique-brown uppercase font-semibold">MENU</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl text-espresso hover:text-antique-brown"
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col gap-6 mt-8">
            {SITE_CONFIG.navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-2xl text-espresso tracking-wide hover:text-champagne-gold transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <a
            href={SITE_CONFIG.whatsapp.baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3.5 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-colors"
          >
            Direct WhatsApp: {SITE_CONFIG.whatsapp.rawNumber}
          </a>
        </div>
      </div>
    </>
  );
}
