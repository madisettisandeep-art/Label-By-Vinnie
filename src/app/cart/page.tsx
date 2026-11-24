'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, subtotal, removeFromCart, updateQuantity, setIsCheckoutOpen } = useCart();

  return (
    <div className="bg-warm-ivory min-h-screen pt-36 pb-28 text-espresso">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <h1 className="font-serif text-3xl sm:text-5xl font-normal mb-8 pb-4 border-b border-taupe/20">
          YOUR SHOPPING BAG
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white border border-taupe/15 p-8">
            <p className="text-taupe mb-6 text-sm">Your shopping bag is currently empty.</p>
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-colors inline-block shadow-md"
            >
              EXPLORE ATELIER COLLECTION
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="divide-y divide-taupe/20 bg-white p-6 shadow-sm border border-taupe/15">
              {items.map((item) => (
                <div key={item.id} className="py-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="relative w-24 h-28 bg-soft-ivory flex-shrink-0 border border-taupe/20 rounded-sm overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-espresso">{item.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-taupe font-medium">
                      <span className="bg-soft-ivory px-2 py-0.5 border border-taupe/20 rounded-sm">
                        Size: {item.size}
                      </span>
                      {item.color && (
                        <span className="bg-soft-ivory px-2 py-0.5 border border-taupe/20 rounded-sm">
                          {item.color}
                        </span>
                      )}
                      {item.stitchingOption && (
                        <span className="bg-champagne-beige/40 text-antique-brown font-semibold px-2 py-0.5 border border-champagne-gold/30 rounded-sm uppercase">
                          {item.stitchingOption}
                        </span>
                      )}
                    </div>

                    {item.customMeasurements && (
                      <div className="mt-2 p-2 bg-warm-ivory/60 border border-taupe/15 text-[0.7rem] text-taupe space-y-0.5 rounded-sm">
                        <div className="flex flex-wrap gap-x-3">
                          {item.customMeasurements.bust && <span>Bust: {item.customMeasurements.bust}&quot;</span>}
                          {item.customMeasurements.waist && <span>Waist: {item.customMeasurements.waist}&quot;</span>}
                          {item.customMeasurements.hip && <span>Hip: {item.customMeasurements.hip}&quot;</span>}
                          {item.customMeasurements.shoulder && <span>Shoulder: {item.customMeasurements.shoulder}&quot;</span>}
                          {item.customMeasurements.blouseLength && <span>Length: {item.customMeasurements.blouseLength}&quot;</span>}
                        </div>
                        {item.fittingNotes && (
                          <p className="italic text-espresso/80">Tailoring Note: {item.fittingNotes}</p>
                        )}
                      </div>
                    )}

                    <p className="text-sm font-semibold text-antique-brown mt-2">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center border border-taupe/30 text-xs bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 hover:bg-taupe/20 font-bold text-espresso transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold text-espresso">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 hover:bg-taupe/20 font-bold text-espresso transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[120px] self-end sm:self-center">
                    <span className="font-serif text-lg font-bold text-antique-brown block">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-taupe hover:text-red-700 mt-2 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 shadow-sm border border-taupe/15 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div>
                <span className="text-xs tracking-luxury text-taupe uppercase block">ESTIMATED TOTAL:</span>
                <span className="font-serif text-3xl font-bold text-antique-brown">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
                <p className="text-[0.72rem] text-taupe mt-1">
                  *Confirmed personally via WhatsApp concierge by Vinnie.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/shop"
                  className="px-6 py-3.5 border border-taupe/40 text-espresso text-xs tracking-luxury uppercase font-semibold text-center hover:bg-taupe/10 transition-colors"
                >
                  CONTINUE BROWSING
                </Link>
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-8 py-3.5 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-colors shadow-lg text-center"
                >
                  PROCEED TO WHATSAPP CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
