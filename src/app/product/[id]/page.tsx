'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProductBySlug } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { generateProductEnquiryWhatsAppUrl } from '@/lib/whatsapp/generator';
import { CartItem } from '@/types';

// Color map for luxury swatches
const COLOR_SWATCH_MAP: Record<string, { bg: string; name: string }> = {
  'Ruby Red / Golden Cream': { bg: 'linear-gradient(135deg, #9B1B30 50%, #F5E8C7 50%)', name: 'Ruby Red / Cream' },
  'Pista Green': { bg: '#8CA884', name: 'Pista Green' },
  'Soft Mint': { bg: '#A8D0BC', name: 'Soft Mint' },
  'Olive Green / Antique Gold Zari': { bg: 'linear-gradient(135deg, #556B2F 50%, #C5A059 50%)', name: 'Olive Green / Gold Zari' },
  'Regal Burgundy': { bg: '#5B1E31', name: 'Regal Burgundy' },
  'Royal Lilac Purple / Warm Gold': { bg: 'linear-gradient(135deg, #6A4C93 50%, #D4AF37 50%)', name: 'Royal Purple / Gold' },
  'Rose Gold Pink': { bg: '#D4838F', name: 'Rose Gold Pink' },
  'Navy Blue / Gold Border': { bg: 'linear-gradient(135deg, #102542 60%, #C5A059 40%)', name: 'Navy Blue / Gold' },
  'Royal Cobalt Blue': { bg: '#1D3557', name: 'Cobalt Blue' },
  'Antique Ivory / Champagne Gold': { bg: 'linear-gradient(135deg, #FAF7F0 60%, #C5A059 40%)', name: 'Antique Ivory / Gold' },
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.id as string;
  const product = getProductBySlug(slug);

  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0] || 'Atelier Standard');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || '');
  const [stitchingOption, setStitchingOption] = useState<'standard' | 'custom' | 'unstitched'>('standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hip: '',
    shoulder: '',
    sleeveLength: '',
    blouseLength: '',
    garmentLength: '',
  });
  const [fittingNotes, setFittingNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

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

  const isFabricSet = product.category === 'chanderi' || product.sizes.some((s) => s.toLowerCase().includes('unstitched'));
  const isBlouse = product.category === 'couture' || product.category === 'custom' || product.slug.includes('blouse');

  const stitchingCharge =
    stitchingOption === 'custom'
      ? isBlouse
        ? 500
        : isFabricSet
        ? 1200
        : 600
      : stitchingOption === 'standard' && isFabricSet
      ? 750
      : 0;

  const unitPrice = product.price + stitchingCharge;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    setErrorMsg('');

    if (!selectedSize) {
      setErrorMsg('Please select your preferred size or fit option.');
      return;
    }

    if (stitchingOption === 'custom') {
      const hasAnyMeasurement =
        measurements.bust ||
        measurements.waist ||
        measurements.hip ||
        measurements.shoulder ||
        measurements.sleeveLength ||
        measurements.blouseLength ||
        measurements.garmentLength ||
        fittingNotes.trim();

      if (!hasAnyMeasurement) {
        setErrorMsg('Please enter at least one key body measurement or tailoring instruction for custom fitting.');
        return;
      }
    }

    const uniqueId = `${product.id}-${selectedSize}-${selectedColor}-${stitchingOption}-${Date.now()}`;

    const configuredItem: CartItem = {
      id: uniqueId,
      productId: product.id,
      name: product.name,
      price: unitPrice,
      basePrice: product.price,
      image: product.images[selectedImage] || product.images[0],
      size: selectedSize,
      color: selectedColor,
      stitchingOption,
      stitchingPrice: stitchingCharge,
      customMeasurements: stitchingOption === 'custom' ? measurements : undefined,
      fittingNotes: fittingNotes.trim() || undefined,
      quantity,
      isCustom: stitchingOption === 'custom' || product.madeToOrder,
    };

    addToCart(configuredItem);
    setToastMessage('Added to your shopping bag!');
    setTimeout(() => setToastMessage(''), 2500);
  };

  const waUrl = generateProductEnquiryWhatsAppUrl(product, selectedSize);

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
            <div className="relative h-[560px] sm:h-[620px] w-full bg-[#EAE3D5] overflow-hidden mb-4 shadow-md border border-champagne-gold/20">
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
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-24 overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === idx ? 'border-antique-brown shadow-md scale-105' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Configuration Selection Form */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs tracking-luxury text-antique-brown uppercase font-semibold block mb-2">
                  {product.categoryTitle}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight mb-3">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-serif text-3xl font-bold text-antique-brown">
                    ₹{unitPrice.toLocaleString('en-IN')}
                  </span>
                  {stitchingCharge > 0 && (
                    <span className="text-xs text-taupe">
                      (Base: ₹{product.price.toLocaleString('en-IN')} + Stitching: ₹{stitchingCharge.toLocaleString('en-IN')})
                    </span>
                  )}
                  <span className="text-xs tracking-wider text-taupe font-medium ml-auto">
                    {product.madeToOrder ? 'Handcrafted Made-to-Order' : 'Ready to Dispatch'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-taupe leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* A. Colour Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="pt-2 border-t border-taupe/15">
                  <label className="block text-[0.72rem] tracking-widest uppercase font-semibold text-espresso mb-2.5">
                    Select Colour: <span className="font-serif font-normal text-antique-brown text-sm">({selectedColor})</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color) => {
                      const swatch = COLOR_SWATCH_MAP[color] || { bg: '#8A7968', name: color };
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          type="button"
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm transition-all text-xs ${
                            isSelected
                              ? 'border-antique-brown bg-soft-ivory shadow-sm ring-1 ring-antique-brown'
                              : 'border-taupe/30 hover:border-taupe/60 bg-white'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                            style={{ background: swatch.bg }}
                          />
                          <span className={`tracking-wider ${isSelected ? 'font-bold text-espresso' : 'text-taupe'}`}>
                            {swatch.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* B. Size Selection */}
              <div className="pt-2 border-t border-taupe/15">
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-[0.72rem] tracking-widest uppercase font-semibold text-espresso">
                    Select Size / Fit <span className="text-red-700">*</span>:
                  </label>
                  <span className="text-[0.68rem] text-taupe tracking-wider">Atelier sizing standard</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedSize(s);
                        if (s.toLowerCase().includes('custom')) setStitchingOption('custom');
                      }}
                      className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold border transition-all rounded-sm ${
                        selectedSize === s
                          ? 'bg-antique-brown text-soft-ivory border-antique-brown shadow-sm'
                          : 'bg-white text-espresso border-taupe/30 hover:border-antique-brown'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* C. Stitching Options */}
              <div className="pt-2 border-t border-taupe/15">
                <label className="text-[0.72rem] tracking-widest uppercase font-semibold text-espresso block mb-2.5">
                  Stitching &amp; Finishing:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {isFabricSet && (
                    <button
                      type="button"
                      onClick={() => setStitchingOption('unstitched')}
                      className={`p-2.5 text-left border rounded-sm transition-all text-xs ${
                        stitchingOption === 'unstitched'
                          ? 'border-antique-brown bg-soft-ivory ring-1 ring-antique-brown'
                          : 'border-taupe/30 bg-white'
                      }`}
                    >
                      <p className="font-semibold text-espresso">Unstitched</p>
                      <p className="text-[0.68rem] text-taupe">Raw fabric cut</p>
                      <p className="text-[0.68rem] font-bold text-antique-brown mt-1">Included</p>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setStitchingOption('standard')}
                    className={`p-2.5 text-left border rounded-sm transition-all text-xs ${
                      stitchingOption === 'standard'
                        ? 'border-antique-brown bg-soft-ivory ring-1 ring-antique-brown'
                        : 'border-taupe/30 bg-white'
                    }`}
                  >
                    <p className="font-semibold text-espresso">Standard Tailoring</p>
                    <p className="text-[0.68rem] text-taupe">Chart-based fit</p>
                    <p className="text-[0.68rem] font-bold text-antique-brown mt-1">
                      {isFabricSet ? '+₹750' : 'Included'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStitchingOption('custom')}
                    className={`p-2.5 text-left border rounded-sm transition-all text-xs ${
                      stitchingOption === 'custom'
                        ? 'border-antique-brown bg-soft-ivory ring-1 ring-antique-brown'
                        : 'border-taupe/30 bg-white'
                    }`}
                  >
                    <p className="font-semibold text-espresso">Custom Bespoke</p>
                    <p className="text-[0.68rem] text-taupe">Exact body fit</p>
                    <p className="text-[0.68rem] font-bold text-antique-brown mt-1">
                      +{isBlouse ? '₹500' : isFabricSet ? '₹1,200' : '₹600'}
                    </p>
                  </button>
                </div>
              </div>

              {/* D. Custom Stitching Inputs (When custom stitching is active) */}
              {stitchingOption === 'custom' && (
                <div className="p-4 bg-soft-ivory border border-champagne-gold/30 rounded-sm space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-taupe/20 pb-2">
                    <span className="text-[0.7rem] tracking-luxury uppercase font-semibold text-antique-brown">
                      Bespoke Measurements (Inches)
                    </span>
                    <span className="text-[0.65rem] text-taupe">Enter what you know</span>
                  </div>

                  {isBlouse ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[0.65rem] text-taupe uppercase mb-1">Bust (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="36"
                          value={measurements.bust}
                          onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
                          className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] text-taupe uppercase mb-1">Waist (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="30"
                          value={measurements.waist}
                          onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                          className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] text-taupe uppercase mb-1">Shoulder (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="14.5"
                          value={measurements.shoulder}
                          onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                          className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] text-taupe uppercase mb-1">Blouse Length (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="14"
                          value={measurements.blouseLength}
                          onChange={(e) => setMeasurements({ ...measurements, blouseLength: e.target.value })}
                          className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[0.65rem] text-taupe uppercase mb-1">Bust (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="38"
                          value={measurements.bust}
                          onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
                          className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] text-taupe uppercase mb-1">Waist (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="32"
                          value={measurements.waist}
                          onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                          className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] text-taupe uppercase mb-1">Hip (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="40"
                          value={measurements.hip}
                          onChange={(e) => setMeasurements({ ...measurements, hip: e.target.value })}
                          className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] text-taupe uppercase mb-1">Kurta Length (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="44"
                          value={measurements.garmentLength}
                          onChange={(e) => setMeasurements({ ...measurements, garmentLength: e.target.value })}
                          className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[0.65rem] text-taupe uppercase mb-1">Fitting &amp; Neckline Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Keep 2 inch side seam margin, Sweetheart neckline with piping"
                      value={fittingNotes}
                      onChange={(e) => setFittingNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                    />
                  </div>
                </div>
              )}

              {/* E. Quantity Controls */}
              <div className="pt-2 border-t border-taupe/15 flex items-center justify-between">
                <div>
                  <label className="text-[0.72rem] tracking-widest uppercase font-semibold text-espresso block mb-1">
                    Quantity:
                  </label>
                  <div className="inline-flex items-center border border-taupe/30 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-taupe/20 text-sm font-bold"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-taupe/20 text-sm font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[0.68rem] text-taupe uppercase tracking-wider block">Total Subtotal:</span>
                  <span className="font-serif text-2xl font-bold text-antique-brown">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-medium rounded-sm">
                  {errorMsg}
                </div>
              )}

              {/* Success Toast */}
              {toastMessage && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-sm animate-fade-in flex items-center gap-2">
                  <span>✓</span>
                  <span>{toastMessage}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-taupe/20 mt-8">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-4 bg-espresso text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-antique-brown transition-all shadow-xl"
              >
                ADD CONFIGURED PIECE TO SHOPPING BAG
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#25D366] text-white text-xs tracking-luxury uppercase font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
              >
                <span>💬</span>
                <span>DIRECT WHATSAPP CONSULTATION &amp; ORDER</span>
              </a>
            </div>

            {/* Specifications Accordion */}
            <div className="border-t border-taupe/20 pt-6 mt-6 space-y-4 text-xs text-taupe">
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

        </div>
      </div>
    </div>
  );
}
