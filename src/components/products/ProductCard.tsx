'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { generateProductEnquiryWhatsAppUrl } from '@/lib/whatsapp/generator';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/assets/products/bandhani-aline-kurta-dupatta.jpg',
      size: product.sizes[0] || 'Standard',
      isCustom: product.madeToOrder,
    });
  };

  const waUrl = generateProductEnquiryWhatsAppUrl(product);

  return (
    <div className="group flex flex-col h-full bg-white rounded-md overflow-hidden border border-champagne-gold/20 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-champagne-gold/50">
      <Link href={`/product/${product.slug}`} className="relative h-[320px] w-full bg-[#EAE3D5] overflow-hidden block shrink-0">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-espresso/90 text-champagne-gold border border-champagne-gold/30 text-[0.62rem] tracking-luxury uppercase px-2.5 py-0.5 font-semibold">
          {product.categoryTitle}
        </span>
      </Link>

      <div className="flex flex-col p-4 flex-1 justify-between gap-2">
        <div>
          <span className="text-[0.65rem] tracking-luxury text-taupe uppercase font-semibold block mb-1">
            {product.fabric.split('with')[0]}
          </span>
          <h3 className="font-serif text-base leading-snug text-espresso group-hover:text-antique-brown transition-colors line-clamp-2 min-h-[2.8em]">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-taupe/80 line-clamp-2 leading-relaxed mt-1 min-h-[2.8em]">
            {product.description}
          </p>
        </div>

        <div className="mt-auto pt-2 border-t border-champagne-gold/15">
          <div className="flex justify-between items-center min-h-[32px]">
            <span className="font-bold text-espresso text-base">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[0.7rem] text-taupe font-medium max-w-[55%] truncate" title={product.sizes.join(' • ')}>
              {product.sizes.slice(0, 2).join(' • ')}
            </span>
          </div>

          <div className="flex gap-2 mt-2.5">
            <button
              onClick={handleAdd}
              className="flex-1 py-2 bg-espresso text-soft-ivory text-[0.7rem] tracking-luxury uppercase font-semibold hover:bg-antique-brown transition-colors rounded"
            >
              ADD TO BAG
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-9 bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity rounded shrink-0"
              title="Instant WhatsApp Enquiry"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
