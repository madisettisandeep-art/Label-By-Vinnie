'use client';

import React, { useState } from 'react';
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

  if (!isCheckoutOpen) return null;

  const orderRef = `LBV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderRecord: Order = {
      id: crypto.randomUUID ? crypto.randomUUID() : orderRef,
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
    <div className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-warm-ivory text-espresso p-8 shadow-2xl max-h-[92vh] overflow-y-auto animate-scale-up">
        
        <div className="flex justify-between items-center pb-4 border-b border-taupe/20 mb-6">
          <div>
            <h3 className="font-serif text-2xl tracking-wide">CONFIRM ORDER REQUEST</h3>
            <span className="text-[0.72rem] tracking-luxury text-antique-brown font-mono font-semibold">
              REF: {orderRef}
            </span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="text-3xl text-espresso hover:text-antique-brown leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[0.75rem] tracking-widest uppercase font-semibold text-espresso mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Radhika Vajinepalli"
              className="w-full p-3 border border-taupe/30 bg-white text-sm focus:outline-antique-brown"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.75rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                WhatsApp Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full p-3 border border-taupe/30 bg-white text-sm focus:outline-antique-brown"
              />
            </div>
            <div>
              <label className="block text-[0.75rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ananya@example.com"
                className="w-full p-3 border border-taupe/30 bg-white text-sm focus:outline-antique-brown"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.75rem] tracking-widest uppercase font-semibold text-espresso mb-1">
              Delivery Address *
            </label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House/Apartment #, Street, Landmark"
              className="w-full p-3 border border-taupe/30 bg-white text-sm focus:outline-antique-brown"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Hyderabad"
                className="w-full p-2.5 border border-taupe/30 bg-white text-sm focus:outline-antique-brown"
              />
            </div>
            <div>
              <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Telangana"
                className="w-full p-2.5 border border-taupe/30 bg-white text-sm focus:outline-antique-brown"
              />
            </div>
            <div>
              <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="500081"
                className="w-full p-2.5 border border-taupe/30 bg-white text-sm focus:outline-antique-brown"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.75rem] tracking-widest uppercase font-semibold text-espresso mb-1">
              Custom Stitching / Alteration Notes
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Please add 2 inches margin to the kurta side seam"
              className="w-full p-3 border border-taupe/30 bg-white text-sm focus:outline-antique-brown"
            />
          </div>

          {/* Order Summary Box */}
          <div className="p-4 bg-champagne-beige/25 border border-taupe/20 text-xs space-y-1.5 my-4">
            <div className="flex justify-between">
              <span>Items Count:</span>
              <span className="font-semibold">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
            </div>
            <div className="flex justify-between text-sm font-serif font-bold text-antique-brown pt-1 border-t border-taupe/20">
              <span>Order Subtotal:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-all shadow-xl"
          >
            {isSubmitting ? 'GENERATING REQUEST...' : 'SUBMIT & CONTINUE TO WHATSAPP'}
          </button>

          <p className="text-[0.72rem] text-taupe text-center leading-relaxed">
            Payment gateway is not integrated. Your order request will be confirmed personally by Vinnie via WhatsApp with availability &amp; payment guidance.
          </p>
        </form>
      </div>
    </div>
  );
}
