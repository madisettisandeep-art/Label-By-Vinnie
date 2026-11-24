'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const {
    items,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    setIsCheckoutOpen,
  } = useCart();

  // Scroll lock and Escape key listener
  useEffect(() => {
    if (!isCartOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Your Shopping Bag"
    >
      <div className="w-full max-w-md bg-warm-ivory text-espresso h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl overflow-hidden animate-slide-left border-l border-champagne-gold/30">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-5 border-b border-taupe/20 shrink-0">
          <div>
            <h3 className="font-serif text-2xl tracking-wide">YOUR SHOPPING BAG</h3>
            <span className="text-[0.72rem] tracking-luxury text-antique-brown font-semibold uppercase">
              {items.reduce((sum, item) => sum + item.quantity, 0)} {items.length === 1 ? 'PIECE' : 'PIECES'}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close shopping bag drawer"
            className="text-3xl text-espresso hover:text-antique-brown leading-none px-2 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Items Container */}
        <div className="divide-y divide-taupe/20 my-4 flex-1 overflow-y-auto pr-1 space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-taupe text-sm">Your shopping bag is currently empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2.5 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-all"
              >
                EXPLORE ATELIER
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-start">
                {/* Thumbnail */}
                <div className="relative w-20 h-24 bg-[#EAE3D5] overflow-hidden shrink-0 border border-champagne-gold/20 rounded-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="font-serif text-base font-semibold leading-snug text-espresso truncate">
                      {item.name}
                    </h4>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-1.5 mt-1 text-[0.68rem] text-taupe font-medium">
                      <span className="bg-white/80 px-1.5 py-0.5 border border-taupe/20 rounded-sm">
                        Size: {item.size}
                      </span>
                      {item.color && (
                        <span className="bg-white/80 px-1.5 py-0.5 border border-taupe/20 rounded-sm">
                          {item.color}
                        </span>
                      )}
                      {item.stitchingOption && (
                        <span className="bg-champagne-beige/40 text-antique-brown font-semibold px-1.5 py-0.5 border border-champagne-gold/30 rounded-sm uppercase">
                          {item.stitchingOption}
                        </span>
                      )}
                    </div>

                    {/* Custom Measurements Summary if present */}
                    {item.customMeasurements && (
                      <div className="mt-1.5 p-1.5 bg-soft-ivory border border-taupe/15 text-[0.62rem] text-taupe space-y-0.5 rounded-sm">
                        <div className="flex flex-wrap gap-x-2">
                          {item.customMeasurements.bust && <span>Bust: {item.customMeasurements.bust}&quot;</span>}
                          {item.customMeasurements.waist && <span>Waist: {item.customMeasurements.waist}&quot;</span>}
                          {item.customMeasurements.hip && <span>Hip: {item.customMeasurements.hip}&quot;</span>}
                          {item.customMeasurements.shoulder && <span>Shoulder: {item.customMeasurements.shoulder}&quot;</span>}
                          {item.customMeasurements.blouseLength && <span>Length: {item.customMeasurements.blouseLength}&quot;</span>}
                        </div>
                        {item.fittingNotes && (
                          <p className="italic text-espresso/80 truncate">Note: {item.fittingNotes}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-taupe/10">
                    <div className="flex items-center border border-taupe/30 bg-white text-xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-taupe/20 text-espresso font-bold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-espresso">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-taupe/20 text-espresso font-bold transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif font-bold text-antique-brown text-base">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                  className="text-taupe hover:text-red-700 text-lg leading-none p-1 transition-colors"
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Trigger */}
        <div className="border-t border-taupe/20 pt-5 shrink-0 bg-warm-ivory">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs uppercase tracking-widest text-taupe font-semibold">Subtotal:</span>
            <span className="font-serif text-2xl font-bold text-antique-brown">
              ₹{subtotal.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[0.68rem] text-taupe mb-4 leading-relaxed">
            *Taxes and worldwide delivery charges confirmed directly by designer Vinnie via WhatsApp.
          </p>
          <button
            disabled={items.length === 0}
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
            className="w-full py-4 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
          >
            <span>PROCEED TO WHATSAPP CHECKOUT</span>
            <span>&rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
