'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { generateCartOrderWhatsAppUrl } from '@/lib/whatsapp/generator';
import { Order } from '@/types';

export function WhatsAppCheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isCheckoutOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCheckoutOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCheckoutOpen, setIsCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const orderRef = `LBV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderRecord: Order = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : orderRef,
      orderReference: orderRef,
      customer: formData,
      items: [...items],
      subtotal: subtotal,
      shipping: 0,
      total: subtotal,
      status: 'PENDING_WHATSAPP_CONFIRMATION',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in browser state / database
    try {
      const existing = JSON.parse(localStorage.getItem('lbv_orders') || '[]');
      existing.unshift(orderRecord);
      localStorage.setItem('lbv_orders', JSON.stringify(existing));
    } catch (err) {
      console.warn('Unable to persist order locally', err);
    }

    // Build URL-encoded WhatsApp link
    const waUrl = generateCartOrderWhatsAppUrl(orderRecord);

    setIsSubmitting(false);
    clearCart();
    setIsCheckoutOpen(false);

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-[5000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCheckoutOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm WhatsApp Order Request"
    >
      <div className="w-full max-w-xl bg-warm-ivory text-espresso p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto animate-scale-up border border-champagne-gold/30">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-taupe/20 mb-5">
          <div>
            <h3 className="font-serif text-2xl tracking-wide">CONFIRM ORDER REQUEST</h3>
            <span className="text-[0.72rem] tracking-luxury text-antique-brown font-mono font-semibold">
              REF: {orderRef}
            </span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close checkout modal"
            className="text-3xl text-espresso hover:text-antique-brown leading-none px-2 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Order Review List */}
        <div className="mb-5 bg-white border border-champagne-gold/25 p-3 rounded-sm">
          <p className="text-[0.7rem] tracking-luxury uppercase font-semibold text-antique-brown mb-2 border-b border-taupe/15 pb-1">
            Order Review ({items.reduce((s, i) => s + i.quantity, 0)} Pieces):
          </p>
          <div className="max-h-36 overflow-y-auto divide-y divide-taupe/15 pr-1 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 flex gap-2.5 items-center text-xs">
                <div className="relative w-10 h-12 bg-soft-ivory shrink-0 overflow-hidden border border-taupe/20">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold text-espresso truncate">{item.name}</p>
                  <p className="text-[0.68rem] text-taupe truncate">
                    Size: {item.size} {item.color ? `• ${item.color}` : ''} {item.stitchingOption ? `• ${item.stitchingOption}` : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-taupe text-[0.7rem]">&times;{item.quantity}</span>
                  <p className="font-serif font-bold text-antique-brown">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-baseline pt-2.5 mt-2 border-t border-taupe/20 text-xs font-semibold">
            <span className="uppercase tracking-wider text-taupe">Order Subtotal:</span>
            <span className="font-serif text-base font-bold text-antique-brown">
              ₹{subtotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Client Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Radhika Vajinepalli"
              className="w-full p-2.5 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                WhatsApp Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full p-2.5 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
              />
            </div>
            <div>
              <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ananya@example.com"
                className="w-full p-2.5 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
              Delivery Address *
            </label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House/Apartment #, Street, Landmark"
              className="w-full p-2.5 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[0.7rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Hyderabad"
                className="w-full p-2 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
              />
            </div>
            <div>
              <label className="block text-[0.7rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Telangana"
                className="w-full p-2 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
              />
            </div>
            <div>
              <label className="block text-[0.7rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="500081"
                className="w-full p-2 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
              Custom Stitching / Fitting Instructions
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Please add 2 inches margin to the kurta side seam"
              className="w-full p-2.5 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'GENERATING REQUEST...' : 'SUBMIT & CONTINUE TO WHATSAPP'}</span>
            <span>&rarr;</span>
          </button>

          <p className="text-[0.68rem] text-taupe text-center leading-relaxed">
            Direct atelier ordering via WhatsApp with designer Vinnie. Delivery timeline &amp; payment options will be confirmed directly.
          </p>
        </form>
      </div>
    </div>
  );
}
