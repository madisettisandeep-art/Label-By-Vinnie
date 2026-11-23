'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/config/site';

export function Footer() {
  return (
    <footer id="contact" className="bg-[#15110D] text-soft-ivory pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-warm-ivory/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-champagne-gold">
                <Image
                  src="/assets/brand/logo.jpg"
                  alt="Label By Vinnie"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-xl tracking-luxury font-semibold">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-warm-ivory/65 max-w-sm mb-6 font-light">
              Women&apos;s ethnic contemporary wear, handcrafted with premium fabrics. Bespoke designer blouses, Chanderi zari ensembles, and authentic Bandhani creations shipped across India &amp; the USA.
            </p>
            <div className="inline-block bg-warm-ivory/5 border border-champagne-gold/30 p-4">
              <span className="block text-[0.68rem] tracking-luxury text-champagne-gold uppercase mb-1 font-semibold">
                WHATSAPP ATELIER CONCIERGE:
              </span>
              <a
                href={SITE_CONFIG.whatsapp.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-lg text-soft-ivory hover:text-champagne-gold transition-colors tracking-wide"
              >
                {SITE_CONFIG.whatsapp.rawNumber}
              </a>
            </div>
          </div>

          {/* Links: Atelier */}
          <div>
            <h4 className="text-xs tracking-luxury text-champagne-gold uppercase font-semibold mb-6">
              ATELIER
            </h4>
            <ul className="space-y-3 text-sm text-warm-ivory/70">
              <li><Link href="/collections" className="hover:text-champagne-gold transition-colors">Collections</Link></li>
              <li><Link href="/shop" className="hover:text-champagne-gold transition-colors">Boutique Shop</Link></li>
              <li><Link href="/custom-stitching" className="hover:text-champagne-gold transition-colors">Custom Stitching Studio</Link></li>
              <li><Link href="/#story" className="hover:text-champagne-gold transition-colors">Our Craft &amp; Story</Link></li>
            </ul>
          </div>

          {/* Links: Client Care */}
          <div>
            <h4 className="text-xs tracking-luxury text-champagne-gold uppercase font-semibold mb-6">
              CLIENT CARE
            </h4>
            <ul className="space-y-3 text-sm text-warm-ivory/70">
              <li>
                <a
                  href={`${SITE_CONFIG.whatsapp.baseUrl}?text=${encodeURIComponent('Hello Label By Vinnie, I would like to place an order enquiry.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-champagne-gold transition-colors"
                >
                  Order Enquiries
                </a>
              </li>
              <li>
                <a
                  href={`${SITE_CONFIG.whatsapp.baseUrl}?text=${encodeURIComponent('Hello Label By Vinnie, I would like to book a boutique appointment.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-champagne-gold transition-colors"
                >
                  Book Appointment
                </a>
              </li>
              <li><span className="cursor-default">Worldwide Shipping: India &amp; USA</span></li>
              <li><span className="cursor-default">Bespoke Alteration Support</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs tracking-luxury text-champagne-gold uppercase font-semibold mb-6">
              CONTACT
            </h4>
            <ul className="space-y-3 text-sm text-warm-ivory/70">
              <li>
                <span className="block text-[0.68rem] tracking-luxury text-champagne-gold uppercase font-semibold">Direct WhatsApp:</span>
                <a href={SITE_CONFIG.whatsapp.baseUrl} target="_blank" rel="noopener noreferrer" className="hover:text-champagne-gold transition-colors">
                  {SITE_CONFIG.whatsapp.rawNumber}
                </a>
              </li>
              <li>
                <span className="block text-[0.68rem] tracking-luxury text-champagne-gold uppercase font-semibold">Instagram:</span>
                <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-champagne-gold transition-colors">
                  {SITE_CONFIG.instagramHandle}
                </a>
              </li>
              <li>
                <span className="block text-[0.68rem] tracking-luxury text-champagne-gold uppercase font-semibold">Atelier Location:</span>
                <span>Hyderabad, India (Shipping Worldwide)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-warm-ivory/40 gap-4">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All Rights Reserved. Co-founder: {SITE_CONFIG.coFounder}.</p>
          <div className="flex gap-4">
            <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-champagne-gold transition-colors">
              Instagram {SITE_CONFIG.instagramHandle}
            </a>
            <span>•</span>
            <span>Handcrafted in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
