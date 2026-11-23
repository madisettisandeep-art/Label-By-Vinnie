'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProductBySlug } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { generateProductEnquiryWhatsAppUrl } from '@/lib/whatsapp/generator';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.id as string;
  const product = getProductBySlug(slug);

  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!product) {
    return (
      <div className="bg-warm-ivory min-h-screen pt-40 pb-20 text-center">
        <h2 className="font-serif text-3xl text-espresso mb-4">Product Not Found</h2>
        <Link href="/shop" className="text-xs tracking-luxury text-antique-brown uppercase font-semibold underline">
          Return to Boutique Shop
        </Link>
      </div>
    );
  }

  const currentSize = selectedSize || product.sizes[0];

  const handleAdd = () => {
    addToCart({
      id: `${product.id}-${currentSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[selectedImage] || product.images[0],
      size: currentSize,
      isCustom: product.madeToOrder,
    });
  };

  const waUrl = generateProductEnquiryWhatsAppUrl(product, currentSize);

  return (
    <div className="bg-warm-ivory min-h-screen pt-36 pb-28 text-espresso">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Breadcrumb */}
        <div className="text-xs text-taupe tracking-wider mb-8">
          <Link href="/" className="hover:text-espresso">HOME</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-espresso">SHOP</Link>
          <span className="mx-2">/</span>
          <span className="text-antique-brown font-semibold uppercase">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Gallery View */}
          <div>
            <div className="relative h-[620px] w-full bg-[#EAE3D5] overflow-hidden mb-4 shadow-md">
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-24 overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === idx ? 'border-antique-brown' : 'border-transparent opacity-70'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs tracking-luxury text-antique-brown uppercase font-semibold block mb-2">
                {product.categoryTitle}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-serif text-3xl font-bold text-antique-brown">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs tracking-wider text-taupe">
                  {product.madeToOrder ? 'Handcrafted Made-to-Order' : 'Ready to Dispatch'}
                </span>
              </div>

              <p className="text-sm text-taupe leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mb-8">
                <label className="block text-xs tracking-luxury uppercase font-semibold text-espresso mb-3">
                  Select Size / Style:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2.5 text-xs tracking-wider uppercase font-semibold border transition-all ${
                        currentSize === s
                          ? 'bg-antique-brown text-soft-ivory border-antique-brown'
                          : 'bg-white text-espresso border-taupe/30 hover:border-antique-brown'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="border-t border-taupe/20 pt-6 space-y-4 text-xs text-taupe mb-8">
                <div>
                  <strong className="text-espresso block mb-1">Fabric &amp; Weave:</strong>
                  {product.fabric}
                </div>
                <div>
                  <strong className="text-espresso block mb-1">Artisan Highlights:</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-espresso block mb-1">Garment Care:</strong>
                  {product.care.join(' • ')}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-taupe/20">
              <button
                onClick={handleAdd}
                className="w-full py-4 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-all shadow-xl"
              >
                ADD TO SHOPPING BAG
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#25D366] text-white text-xs tracking-luxury uppercase font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span>💬</span>
                <span>DIRECT WHATSAPP CONSULTATION &amp; ORDER</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
