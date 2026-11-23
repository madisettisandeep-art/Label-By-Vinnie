'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export function BrandIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    const onScroll = () => {
      setIsVisible(false);
    };

    window.addEventListener('scroll', onScroll, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-warm-ivory flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="text-center animate-fade-in flex flex-col items-center">
        <div className="relative w-28 h-28 mb-6 p-1 rounded-full border border-champagne-gold">
          <Image
            src="/assets/brand/logo.jpg"
            alt="Label By Vinnie Monogram"
            width={112}
            height={112}
            className="rounded-full object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 rounded-full border-t-2 border-champagne-gold animate-spin" />
        </div>
        <h2 className="font-serif text-3xl tracking-luxury text-espresso mb-2">
          LABEL BY VINNIE
        </h2>
        <p className="text-xs tracking-widest text-antique-brown uppercase font-medium">
          Unlimited Fashion Choices
        </p>
      </div>
    </div>
  );
}
