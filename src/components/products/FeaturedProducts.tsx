'use client';

import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { getAllProducts, getProductsByCategory } from '@/services/productService';

export function FeaturedProducts() {
  const [filter, setFilter] = useState('all');
  const allProducts = getAllProducts();
  const displayedProducts = getProductsByCategory(filter);

  return (
    <section id="shop" className="py-28 bg-warm-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl text-espresso font-normal">
              SHOP BY COLLECTION
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Styles' },
              { id: 'ethnic', label: 'Ethnic Wear' },
              { id: 'chanderi', label: 'Banarasi & Chanderi' },
              { id: 'couture', label: 'Custom Couture' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-5 py-2.5 text-xs tracking-widest uppercase font-semibold transition-all border ${
                  filter === tab.id
                    ? 'bg-antique-brown text-soft-ivory border-antique-brown'
                    : 'bg-transparent text-espresso border-taupe/30 hover:border-antique-brown'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
