'use client';

import React, { useState } from 'react';
import { getAllProducts } from '@/services/productService';
import { ProductCard } from '@/components/products/ProductCard';

export default function ShopPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const allProducts = getAllProducts();

  const filtered = allProducts.filter((p) => {
    const matchesCat = category === 'all' || p.category === category;
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-warm-ivory min-h-screen pt-36 pb-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs tracking-luxury text-antique-brown uppercase font-semibold block mb-3">
            THE VINNIE ATELIER
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-espresso font-normal mb-4">
            SHOP THE COLLECTION
          </h1>
          <p className="text-sm text-taupe leading-relaxed">
            Handcrafted Banarasi Chanderi ensembles, authentic Bandhani sets, and bespoke designer blouses made to order.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 pb-6 border-b border-taupe/20">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'ethnic', label: 'Ethnic Wear' },
              { id: 'chanderi', label: 'Chanderi Zari' },
              { id: 'contemporary', label: 'Contemporary' },
              { id: 'couture', label: 'Custom Couture' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-5 py-2 text-xs tracking-widest uppercase font-semibold transition-all border ${
                  category === tab.id
                    ? 'bg-antique-brown text-soft-ivory border-antique-brown'
                    : 'bg-transparent text-espresso border-taupe/30 hover:border-antique-brown'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search by weave, fabric..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2.5 bg-white border border-taupe/30 text-xs tracking-wider focus:outline-antique-brown"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-taupe py-20 text-sm">No items found matching your selection.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
