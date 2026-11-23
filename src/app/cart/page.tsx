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
          <div className="text-center py-20">
            <p className="text-taupe mb-6">Your shopping bag is currently empty.</p>
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-colors inline-block"
            >
              EXPLORE ATELIER COLLECTION
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="divide-y divide-taupe/20 bg-white p-6 shadow-sm border border-taupe/15">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="py-4 flex gap-6 items-center">
                  <div className="relative w-24 h-28 bg-soft-ivory flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold">{item.name}</h3>
                    <p className="text-xs text-taupe mt-1">Size: {item.size}</p>
                    <p className="text-sm font-semibold text-antique-brown mt-2">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center border border-taupe/30 text-xs">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 hover:bg-taupe/20 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 hover:bg-taupe/20 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <span className="font-serif text-lg font-bold text-antique-brown">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="block text-xs text-taupe hover:text-red-700 mt-2 ml-auto"
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

              <div className="flex gap-4 w-full sm:w-auto">
                <Link
                  href="/shop"
                  className="px-6 py-4 border border-taupe/40 text-xs tracking-luxury uppercase font-semibold hover:border-espresso transition-colors text-center flex-1 sm:flex-initial"
                >
                  CONTINUE SHOPPING
                </Link>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-8 py-4 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-colors text-center flex-1 sm:flex-initial shadow-xl"
                >
                  PROCEED TO WHATSAPP ORDER
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
