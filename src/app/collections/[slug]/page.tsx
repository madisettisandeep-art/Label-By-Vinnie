'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCollectionBySlug, getAllProducts } from '@/services/productService';
import { ProductCard } from '@/components/products/ProductCard';

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return (
      <div className="bg-warm-ivory min-h-screen pt-40 pb-20 text-center">
        <h2 className="font-serif text-3xl text-espresso mb-4">Collection Not Found</h2>
        <Link href="/collections" className="text-xs tracking-luxury text-antique-brown uppercase font-semibold underline">
          View All Collections
        </Link>
      </div>
    );
  }

  const products = getAllProducts();

  return (
    <div className="bg-warm-ivory min-h-screen pt-36 pb-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Collection Hero Banner */}
        <div className="relative h-[440px] w-full overflow-hidden shadow-xl mb-16">
          <Image
            src={collection.coverImage}
            alt={collection.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15110D]/90 via-[#15110D]/40 to-transparent flex flex-col justify-end p-8 md:p-14 text-soft-ivory">
            <span className="text-xs tracking-luxury text-champagne-gold font-semibold uppercase mb-2">
              EDITION {collection.number}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl uppercase font-normal mb-3">
              {collection.title}
            </h1>
            <p className="font-serif text-lg text-champagne-beige mb-3">{collection.subtitle}</p>
            <p className="text-sm text-warm-ivory/80 max-w-xl font-light leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>

        {/* Collection Items */}
        <div className="mb-10 flex justify-between items-end border-b border-taupe/20 pb-4">
          <h2 className="font-serif text-2xl text-espresso">Pieces in this Edition</h2>
          <span className="text-xs tracking-luxury text-taupe uppercase">{products.length} Designs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
