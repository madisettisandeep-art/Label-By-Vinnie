'use client';

import React from 'react';
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

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-warm-ivory text-espresso h-full flex flex-col justify-between p-8 shadow-2xl overflow-y-auto animate-slide-left">
        <div>
          <div className="flex justify-between items-center pb-6 border-b border-taupe/20">
            <h3 className="font-serif text-2xl tracking-wide">YOUR SHOPPING BAG</h3>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-3xl text-espresso hover:text-antique-brown leading-none"
            >
              &times;
            </button>
          </div>

          <div className="divide-y divide-taupe/20 my-6 max-h-[60vh] overflow-y-auto pr-2">
            {items.length === 0 ? (
              <p className="text-center text-taupe py-12 text-sm">Your shopping bag is currently empty.</p>
            ) : (
              items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="py-4 flex gap-4">
                  <div className="relative w-20 h-24 bg-soft-ivory overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-base leading-snug line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-taupe mt-1">Size: {item.size}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-taupe/30 text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 hover:bg-taupe/20"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 hover:bg-taupe/20"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-antique-brown text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-taupe hover:text-espresso self-start"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-taupe/20 pt-6">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-sm uppercase tracking-widest text-taupe">Subtotal:</span>
            <span className="font-serif text-2xl font-bold text-antique-brown">
              ₹{subtotal.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[0.72rem] text-taupe mb-6 leading-relaxed">
            *Taxes and international/domestic delivery charges confirmed directly by atelier on WhatsApp.
          </p>
          <button
            disabled={items.length === 0}
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
            className="w-full py-4 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          >
            PROCEED TO WHATSAPP ORDER
          </button>
        </div>
      </div>
    </div>
  );
}
