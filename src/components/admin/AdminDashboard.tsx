'use client';

import React, { useState, useEffect } from 'react';
import { Order, CustomStitchingEnquiry, Product, OrderStatus } from '@/types';
import { getAllProducts } from '@/services/productService';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog' | 'stitching'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stitching, setStitching] = useState<CustomStitchingEnquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('lbv_orders') || '[]');
      setOrders(storedOrders);
      const storedStitching = JSON.parse(localStorage.getItem('lbv_stitching') || '[]');
      setStitching(storedStitching);
      setProducts(getAllProducts());
    } catch (e) {
      console.warn('Error loading admin state', e);
    }
  }, []);

  const handleStatusChange = (orderRef: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) =>
      o.orderReference === orderRef ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    );
    setOrders(updated);
    localStorage.setItem('lbv_orders', JSON.stringify(updated));
  };

  return (
    <div className="bg-warm-ivory min-h-screen text-espresso py-16 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-taupe/20 mb-8 gap-4">
          <div>
            <span className="text-xs tracking-luxury text-antique-brown uppercase font-semibold">
              ATELIER MANAGEMENT PORTAL
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal">
              LABEL BY VINNIE — BOUTIQUE DASHBOARD
            </h1>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 py-1 bg-antique-brown text-soft-ivory text-xs font-semibold tracking-wider uppercase">
              Admin Mode
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-taupe/20 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 text-xs tracking-luxury uppercase font-semibold transition-all border-b-2 ${
              activeTab === 'orders'
                ? 'border-antique-brown text-antique-brown'
                : 'border-transparent text-taupe hover:text-espresso'
            }`}
          >
            WhatsApp Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-4 text-xs tracking-luxury uppercase font-semibold transition-all border-b-2 ${
              activeTab === 'catalog'
                ? 'border-antique-brown text-antique-brown'
                : 'border-transparent text-taupe hover:text-espresso'
            }`}
          >
            Product Catalogue ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('stitching')}
            className={`pb-4 text-xs tracking-luxury uppercase font-semibold transition-all border-b-2 ${
              activeTab === 'stitching'
                ? 'border-antique-brown text-antique-brown'
                : 'border-transparent text-taupe hover:text-espresso'
            }`}
          >
            Custom Stitching Requests ({stitching.length})
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 shadow-md border border-taupe/15">
            <h3 className="font-serif text-xl mb-4 text-espresso">Recorded WhatsApp Orders</h3>
            {orders.length === 0 ? (
              <p className="text-sm text-taupe py-8 text-center">No customer order requests recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#EAE1D1] text-espresso uppercase tracking-wider">
                      <th className="p-3">Ref #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Delivery Address</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Subtotal</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">WhatsApp Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-taupe/15">
                    {orders.map((o) => (
                      <tr key={o.orderReference} className="hover:bg-warm-ivory/40">
                        <td className="p-3 font-mono font-bold">{o.orderReference}</td>
                        <td className="p-3 font-semibold">{o.customer.name}</td>
                        <td className="p-3">{o.customer.phone}</td>
                        <td className="p-3 max-w-xs truncate">{o.customer.address}, {o.customer.city}</td>
                        <td className="p-3">{o.items.map((i) => `${i.name} (${i.size}) × ${i.quantity}`).join('; ')}</td>
                        <td className="p-3 font-semibold text-antique-brown">₹{o.subtotal.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.orderReference, e.target.value as OrderStatus)}
                            className="p-1 border border-taupe/30 text-[0.72rem] bg-white font-semibold"
                          >
                            <option value="PENDING_WHATSAPP_CONFIRMATION">Pending WhatsApp</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="READY_FOR_DISPATCH">Ready For Dispatch</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <a
                            href={`https://wa.me/${o.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${o.customer.name}, regarding your Label By Vinnie order [${o.orderReference}]:`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-antique-brown font-semibold hover:underline"
                          >
                            Reply on WhatsApp &rarr;
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Catalog */}
        {activeTab === 'catalog' && (
          <div className="bg-white p-6 shadow-md border border-taupe/15">
            <h3 className="font-serif text-xl mb-4 text-espresso">Boutique Catalogue Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EAE1D1] text-espresso uppercase tracking-wider">
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price (INR)</th>
                    <th className="p-3">Available Sizes</th>
                    <th className="p-3">Stock Status</th>
                    <th className="p-3">Catalogue State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/15">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-warm-ivory/40">
                      <td className="p-3 font-semibold">{p.name}</td>
                      <td className="p-3 uppercase text-[0.7rem] text-taupe">{p.categoryTitle}</td>
                      <td className="p-3 font-semibold text-antique-brown">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="p-3">{p.sizes.join(', ')}</td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-[0.65rem] font-semibold">
                          {p.inStock ? 'In Stock' : 'Made to Order'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-[0.65rem] font-semibold">
                          Verified Published
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Stitching */}
        {activeTab === 'stitching' && (
          <div className="bg-white p-6 shadow-md border border-taupe/15">
            <h3 className="font-serif text-xl mb-4 text-espresso">Custom Stitching Studio Enquiries</h3>
            {stitching.length === 0 ? (
              <p className="text-sm text-taupe py-8 text-center">No bespoke stitching requests submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#EAE1D1] text-espresso uppercase tracking-wider">
                      <th className="p-3">Ref #</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Garment</th>
                      <th className="p-3">Fabric</th>
                      <th className="p-3">Measurements</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-taupe/15">
                    {stitching.map((s) => (
                      <tr key={s.referenceNumber} className="hover:bg-warm-ivory/40">
                        <td className="p-3 font-mono font-bold">{s.referenceNumber}</td>
                        <td className="p-3 font-semibold">{s.customerName}</td>
                        <td className="p-3">{s.customerPhone}</td>
                        <td className="p-3">{s.garmentType}</td>
                        <td className="p-3">{s.fabricType}</td>
                        <td className="p-3">
                          Bust: {s.measurements.bust}&quot;, Waist: {s.measurements.waist}&quot;, Length: {s.measurements.garmentLength}&quot;
                        </td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[0.65rem] font-semibold">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
