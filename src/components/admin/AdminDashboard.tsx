'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Order, CustomStitchingEnquiry, Product, OrderStatus, HeroBanner } from '@/types';
import { getAllProducts } from '@/services/productService';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  resetBannersToDefault,
} from '@/services/bannerService';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog' | 'stitching' | 'banners'>('banners');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stitching, setStitching] = useState<CustomStitchingEnquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);

  // Banner Modal States
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [previewBanner, setPreviewBanner] = useState<HeroBanner | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    desktop_image_url: '/assets/campaigns/new-collection-purple-campaign.jpg',
    mobile_image_url: '/assets/campaigns/new-collection-purple-campaign.jpg',
    cta_text: 'Explore Collection',
    destination_url: '/#shop',
    display_order: 1,
    is_active: true,
    starts_at: '',
    ends_at: '',
  });

  const loadData = () => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('lbv_orders') || '[]');
      setOrders(storedOrders);
      const storedStitching = JSON.parse(localStorage.getItem('lbv_stitching') || '[]');
      setStitching(storedStitching);
      setProducts(getAllProducts());
      setBanners(getAllBanners());
    } catch (e) {
      console.warn('Error loading admin state', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (orderRef: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) =>
      o.orderReference === orderRef ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    );
    setOrders(updated);
    localStorage.setItem('lbv_orders', JSON.stringify(updated));
  };

  // Banner Actions
  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      desktop_image_url: '/assets/campaigns/new-collection-purple-campaign.jpg',
      mobile_image_url: '/assets/campaigns/new-collection-purple-campaign.jpg',
      cta_text: 'Explore Collection',
      destination_url: '/#shop',
      display_order: banners.length + 1,
      is_active: true,
      starts_at: '',
      ends_at: '',
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      desktop_image_url: banner.desktop_image_url,
      mobile_image_url: banner.mobile_image_url || '',
      cta_text: banner.cta_text,
      destination_url: banner.destination_url,
      display_order: banner.display_order,
      is_active: banner.is_active,
      starts_at: banner.starts_at ? banner.starts_at.substring(0, 16) : '',
      ends_at: banner.ends_at ? banner.ends_at.substring(0, 16) : '',
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      await updateBanner(editingBanner.id, {
        title: formData.title,
        subtitle: formData.subtitle,
        desktop_image_url: formData.desktop_image_url,
        mobile_image_url: formData.mobile_image_url || undefined,
        cta_text: formData.cta_text,
        destination_url: formData.destination_url,
        display_order: Number(formData.display_order),
        is_active: formData.is_active,
        starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
        ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
      });
    } else {
      await createBanner({
        title: formData.title,
        subtitle: formData.subtitle,
        desktop_image_url: formData.desktop_image_url,
        mobile_image_url: formData.mobile_image_url || undefined,
        cta_text: formData.cta_text,
        destination_url: formData.destination_url,
        display_order: Number(formData.display_order),
        is_active: formData.is_active,
        starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
        ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
      });
    }
    setIsBannerModalOpen(false);
    setBanners(getAllBanners());
  };

  const handleToggleActive = async (banner: HeroBanner) => {
    await updateBanner(banner.id, { is_active: !banner.is_active });
    setBanners(getAllBanners());
  };

  const handleDeleteBanner = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the campaign banner "${title}"?`)) {
      await deleteBanner(id);
      setBanners(getAllBanners());
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const reordered = [...banners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const orderedIds = reordered.map((b) => b.id);
    await reorderBanners(orderedIds);
    setBanners(getAllBanners());
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset all hero campaign banners to official boutique defaults?')) {
      const reset = await resetBannersToDefault();
      setBanners(reset);
    }
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
            <span className="inline-flex items-center px-3 py-1 bg-antique-brown text-soft-ivory text-xs font-semibold tracking-wider uppercase rounded-sm shadow-sm">
              Admin Mode
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 border-b border-taupe/20 mb-8">
          <button
            onClick={() => setActiveTab('banners')}
            className={`pb-4 text-xs tracking-luxury uppercase font-semibold transition-all border-b-2 ${
              activeTab === 'banners'
                ? 'border-antique-brown text-antique-brown'
                : 'border-transparent text-taupe hover:text-espresso'
            }`}
          >
            Hero Banners ({banners.length})
          </button>
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

        {/* Tab: Hero Banners Management */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-white p-6 shadow-md border border-taupe/15 rounded-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-taupe/15 gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-espresso font-normal">
                    Campaign Hero Banners
                  </h3>
                  <p className="text-xs text-taupe mt-1">
                    Manage full-width horizontal campaign banners shown on the homepage hero carousel.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-4 py-2 border border-taupe/30 hover:border-antique-brown text-espresso text-xs font-semibold tracking-wider uppercase rounded-sm transition-all"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="px-5 py-2 bg-antique-brown hover:bg-espresso text-soft-ivory text-xs font-semibold tracking-wider uppercase rounded-sm shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>+ Add Campaign Banner</span>
                  </button>
                </div>
              </div>

              {banners.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-taupe mb-4">No campaign banners configured.</p>
                  <button
                    onClick={handleResetDefaults}
                    className="px-5 py-2 bg-antique-brown text-soft-ivory text-xs uppercase font-semibold"
                  >
                    Load Default Campaigns
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#EAE1D1] text-espresso uppercase tracking-wider font-semibold">
                        <th className="p-3 text-center">Order</th>
                        <th className="p-3">Artwork Preview</th>
                        <th className="p-3">Campaign Title &amp; Subtitle</th>
                        <th className="p-3">CTA &amp; Link</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Schedule</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-taupe/15">
                      {banners.map((banner, index) => (
                        <tr key={banner.id} className="hover:bg-warm-ivory/40 transition-colors">
                          {/* Order Buttons */}
                          <td className="p-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-mono font-bold text-sm w-5">{banner.display_order}</span>
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMoveOrder(index, 'up')}
                                  className="text-[10px] p-0.5 hover:text-antique-brown disabled:opacity-25"
                                  title="Move Up"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  disabled={index === banners.length - 1}
                                  onClick={() => handleMoveOrder(index, 'down')}
                                  className="text-[10px] p-0.5 hover:text-antique-brown disabled:opacity-25"
                                  title="Move Down"
                                >
                                  ▼
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Artwork Thumbnail */}
                          <td className="p-3">
                            <div className="relative w-28 h-12 bg-black/10 rounded overflow-hidden border border-taupe/20 shrink-0">
                              <Image
                                src={banner.desktop_image_url}
                                alt={banner.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>

                          {/* Title & Subtitle */}
                          <td className="p-3 max-w-xs">
                            <p className="font-serif font-semibold text-sm text-espresso">
                              {banner.title}
                            </p>
                            <p className="text-[0.7rem] text-taupe truncate">
                              {banner.subtitle}
                            </p>
                          </td>

                          {/* CTA & Link */}
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 bg-antique-brown/10 text-antique-brown font-semibold rounded text-[0.68rem] mb-1">
                              {banner.cta_text}
                            </span>
                            <p className="text-[0.65rem] text-taupe font-mono truncate max-w-[140px]">
                              {banner.destination_url}
                            </p>
                          </td>

                          {/* Active Toggle */}
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(banner)}
                              className={`px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider rounded-full transition-all ${
                                banner.is_active
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-zinc-100 text-zinc-500 border border-zinc-300'
                              }`}
                            >
                              {banner.is_active ? '● Published' : '○ Draft'}
                            </button>
                          </td>

                          {/* Schedule */}
                          <td className="p-3 text-[0.68rem] text-taupe whitespace-nowrap">
                            {banner.starts_at || banner.ends_at ? (
                              <div>
                                {banner.starts_at && <div>From: {new Date(banner.starts_at).toLocaleDateString()}</div>}
                                {banner.ends_at && <div>To: {new Date(banner.ends_at).toLocaleDateString()}</div>}
                              </div>
                            ) : (
                              <span className="text-zinc-400">Always Active</span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="inline-flex gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewBanner(banner)}
                                className="px-2.5 py-1 text-xs border border-taupe/30 hover:border-antique-brown rounded text-espresso hover:text-antique-brown transition-colors"
                                title="Preview Banner"
                              >
                                👁 Preview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(banner)}
                                className="px-2.5 py-1 text-xs border border-taupe/30 hover:border-antique-brown rounded text-espresso hover:text-antique-brown transition-colors"
                                title="Edit Banner"
                              >
                                ✏ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBanner(banner.id, banner.title)}
                                className="px-2.5 py-1 text-xs border border-red-200 hover:border-red-400 text-red-600 rounded transition-colors"
                                title="Delete Banner"
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

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

      {/* Banner Create / Edit Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-[6000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-warm-ivory text-espresso p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto border border-champagne-gold/40 rounded-sm">
            <div className="flex justify-between items-center pb-4 border-b border-taupe/20 mb-6">
              <h3 className="font-serif text-2xl">
                {editingBanner ? 'Edit Campaign Banner' : 'Create New Campaign Banner'}
              </h3>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="text-3xl leading-none text-espresso hover:text-antique-brown"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The New Collection"
                  className="w-full p-2.5 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                  Campaign Subtitle *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Elegance, woven into every detail."
                  className="w-full p-2.5 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
                />
              </div>

              {/* Preset Image Picker or Custom Path */}
              <div>
                <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                  Desktop Campaign Poster Artwork *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {[
                    { label: 'Purple Saree (Arch)', src: '/assets/campaigns/new-collection-purple-campaign.jpg' },
                    { label: 'Custom Stitching', src: '/assets/campaigns/custom-stitching-campaign.jpg' },
                    { label: 'Timeless Sarees', src: '/assets/campaigns/timeless-ethnic-fashion.jpg' },
                    { label: 'Purple Clean', src: '/assets/campaigns/the-new-collection-clean.jpg' },
                  ].map((preset) => (
                    <button
                      key={preset.src}
                      type="button"
                      onClick={() => setFormData({ ...formData, desktop_image_url: preset.src, mobile_image_url: preset.src })}
                      className={`p-1.5 border text-left rounded text-[0.65rem] transition-all flex flex-col items-center gap-1 ${
                        formData.desktop_image_url === preset.src
                          ? 'border-antique-brown bg-antique-brown/10 font-bold'
                          : 'border-taupe/30 hover:border-taupe bg-white'
                      }`}
                    >
                      <div className="relative w-full h-10 bg-black/10 rounded overflow-hidden">
                        <Image src={preset.src} alt={preset.label} fill className="object-cover" />
                      </div>
                      <span className="truncate w-full text-center">{preset.label}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={formData.desktop_image_url}
                  onChange={(e) => setFormData({ ...formData, desktop_image_url: e.target.value })}
                  placeholder="/assets/campaigns/custom-stitching-campaign.jpg"
                  className="w-full p-2.5 border border-taupe/30 bg-white text-xs font-mono focus:outline-antique-brown"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                  Mobile Artwork (Optional — Defaults to Desktop Artwork)
                </label>
                <input
                  type="text"
                  value={formData.mobile_image_url}
                  onChange={(e) => setFormData({ ...formData, mobile_image_url: e.target.value })}
                  placeholder="e.g. /assets/campaigns/custom-stitching-campaign.jpg"
                  className="w-full p-2.5 border border-taupe/30 bg-white text-xs font-mono focus:outline-antique-brown"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                    Call To Action Button Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="e.g. Explore Collection"
                    className="w-full p-2.5 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
                  />
                </div>
                <div>
                  <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                    Destination URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination_url}
                    onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                    placeholder="e.g. /#shop or /custom-stitching"
                    className="w-full p-2.5 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full p-2 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
                  />
                </div>
                <div>
                  <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                    Schedule Start Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    className="w-full p-2 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
                  />
                </div>
                <div>
                  <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-1">
                    Schedule End Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                    className="w-full p-2 border border-taupe/30 bg-white text-xs focus:outline-antique-brown"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="banner-is-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-antique-brown border-taupe/30 rounded focus:ring-antique-brown"
                />
                <label htmlFor="banner-is-active" className="text-xs font-semibold text-espresso cursor-pointer">
                  Publish Immediately (Uncheck to Save as Draft)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-taupe/15">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-5 py-2.5 border border-taupe/30 text-xs font-semibold uppercase rounded text-espresso hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-antique-brown hover:bg-espresso text-soft-ivory text-xs font-semibold uppercase tracking-wider rounded shadow-md"
                >
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Banner Preview Modal */}
      {previewBanner && (
        <div className="fixed inset-0 z-[6000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#140D09] text-soft-ivory p-6 shadow-2xl border border-champagne-gold/40 rounded-sm">
            <div className="flex justify-between items-center pb-3 border-b border-champagne-gold/20 mb-4">
              <span className="text-xs uppercase tracking-luxury text-champagne-gold font-semibold">
                Live Campaign Banner Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewBanner(null)}
                className="text-2xl leading-none text-soft-ivory hover:text-champagne-gold"
              >
                &times;
              </button>
            </div>

            <div className="relative w-full aspect-[2.4/1] min-h-[360px] rounded overflow-hidden border border-champagne-gold/30">
              <Image
                src={previewBanner.desktop_image_url}
                alt={previewBanner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-3">
              <div>
                <p className="font-serif text-lg text-champagne-beige font-semibold">{previewBanner.title}</p>
                <p className="text-taupe">{previewBanner.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-antique-brown text-soft-ivory text-[0.7rem] uppercase font-semibold rounded">
                  {previewBanner.cta_text} &rarr;
                </span>
                <span className="text-[0.68rem] text-taupe font-mono">
                  {previewBanner.destination_url}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}