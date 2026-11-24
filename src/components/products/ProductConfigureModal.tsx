'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, CartItem } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductConfigureModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// Color map for luxury swatches
const COLOR_SWATCH_MAP: Record<string, { bg: string; border?: string; name: string }> = {
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

export function ProductConfigureModal({ product, isOpen, onClose }: ProductConfigureModalProps) {
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
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
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Determine available stitching options based on product type
  const isFabricSet = product?.category === 'chanderi' || product?.sizes.some((s) => s.toLowerCase().includes('unstitched'));
  const isBlouse = product?.category === 'couture' || product?.category === 'custom' || product?.slug.includes('blouse');

  // Initialize defaults on product change
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors && product.colors[0] ? product.colors[0] : 'Classic Atelier Edition');
      setSelectedSize(product.sizes && product.sizes[0] ? product.sizes[0] : '');
      setStitchingOption(isFabricSet ? 'unstitched' : 'standard');
      setQuantity(1);
      setMeasurements({
        bust: '',
        waist: '',
        hip: '',
        shoulder: '',
        sleeveLength: '',
        blouseLength: '',
        garmentLength: '',
      });
      setFittingNotes('');
      setErrorMsg('');
      setShowSuccessToast(false);
    }
  }, [product, isFabricSet]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Stitching cost configuration
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

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
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
        setErrorMsg('Please provide at least one key measurement (e.g. Bust, Waist) or custom tailoring instructions.');
        return;
      }
    }

    const uniqueCartId = `${product.id}-${selectedSize}-${selectedColor}-${stitchingOption}-${Date.now()}`;

    const configuredItem: CartItem = {
      id: uniqueCartId,
      productId: product.id,
      name: product.name,
      price: unitPrice,
      basePrice: product.price,
      image: product.images[0] || '/assets/products/bandhani-aline-kurta-dupatta.jpg',
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
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[6000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-warm-ivory text-espresso border border-champagne-gold/40 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-taupe/20 bg-soft-ivory/60 shrink-0">
          <div>
            <span className="text-[0.65rem] tracking-luxury text-antique-brown font-semibold uppercase block">
              {product.categoryTitle} • Custom Atelier Selection
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-espresso leading-snug line-clamp-1">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close configuration modal"
            className="text-3xl text-espresso hover:text-antique-brown leading-none px-2"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleAddToCart} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          
          {/* Summary Preview Strip */}
          <div className="flex gap-4 p-3 bg-white border border-champagne-gold/25 rounded-sm">
            <div className="relative w-20 h-24 bg-[#EAE3D5] shrink-0 overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between text-xs">
              <div>
                <p className="font-serif text-base font-semibold text-espresso">{product.name}</p>
                <p className="text-taupe mt-0.5 line-clamp-1">{product.fabric}</p>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-taupe/15">
                <span className="text-taupe">Base Price:</span>
                <span className="font-bold text-espresso text-sm">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* A. Colour Selection with Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-[0.72rem] tracking-widest uppercase font-semibold text-espresso">
                  A. Select Colour: <span className="font-normal text-antique-brown font-serif text-sm">({selectedColor})</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const swatch = COLOR_SWATCH_MAP[color] || { bg: '#8A7968', name: color };
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2.5 px-3 py-2 border rounded-sm transition-all text-xs ${
                        isSelected
                          ? 'border-antique-brown bg-soft-ivory shadow-sm ring-1 ring-antique-brown'
                          : 'border-taupe/30 hover:border-taupe/60 bg-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-inner"
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
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-[0.72rem] tracking-widest uppercase font-semibold text-espresso">
                B. Select Size / Silhouette <span className="text-red-700">*</span>:
              </label>
              <span className="text-[0.68rem] text-taupe tracking-wider">Product-specific sizing</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => {
                      setSelectedSize(s);
                      if (s.toLowerCase().includes('custom')) {
                        setStitchingOption('custom');
                      }
                    }}
                    className={`p-2.5 text-xs text-center border rounded-sm transition-all tracking-wider ${
                      isSelected
                        ? 'border-antique-brown bg-antique-brown text-soft-ivory font-semibold shadow-md'
                        : 'border-taupe/30 bg-white text-espresso hover:border-antique-brown/60'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* C. Stitching Options */}
          <div>
            <label className="text-[0.72rem] tracking-widest uppercase font-semibold text-espresso block mb-2.5">
              C. Stitching &amp; Tailoring Preference:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {isFabricSet && (
                <button
                  type="button"
                  onClick={() => setStitchingOption('unstitched')}
                  className={`p-3 text-left border rounded-sm transition-all text-xs ${
                    stitchingOption === 'unstitched'
                      ? 'border-antique-brown bg-soft-ivory ring-1 ring-antique-brown'
                      : 'border-taupe/30 bg-white'
                  }`}
                >
                  <p className="font-semibold text-espresso">Unstitched Fabric</p>
                  <p className="text-[0.68rem] text-taupe mt-0.5">Raw material cut as-is</p>
                  <p className="text-[0.7rem] font-bold text-antique-brown mt-1.5">Included (₹0)</p>
                </button>
              )}

              <button
                type="button"
                onClick={() => setStitchingOption('standard')}
                className={`p-3 text-left border rounded-sm transition-all text-xs ${
                  stitchingOption === 'standard'
                    ? 'border-antique-brown bg-soft-ivory ring-1 ring-antique-brown'
                    : 'border-taupe/30 bg-white'
                }`}
              >
                <p className="font-semibold text-espresso">Standard Tailoring</p>
                <p className="text-[0.68rem] text-taupe mt-0.5">Pre-tailored to size chart</p>
                <p className="text-[0.7rem] font-bold text-antique-brown mt-1.5">
                  {isFabricSet ? '+₹750' : 'Included (₹0)'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStitchingOption('custom')}
                className={`p-3 text-left border rounded-sm transition-all text-xs ${
                  stitchingOption === 'custom'
                    ? 'border-antique-brown bg-soft-ivory ring-1 ring-antique-brown'
                    : 'border-taupe/30 bg-white'
                }`}
              >
                <p className="font-semibold text-espresso">Custom Bespoke Fit</p>
                <p className="text-[0.68rem] text-taupe mt-0.5">Stitched to your exact measurements</p>
                <p className="text-[0.7rem] font-bold text-antique-brown mt-1.5">
                  +{isBlouse ? '₹500' : isFabricSet ? '₹1,200' : '₹600'}
                </p>
              </button>
            </div>
          </div>

          {/* D. Custom Stitching Measurements Form (Visible when 'custom' is selected) */}
          {stitchingOption === 'custom' && (
            <div className="p-4 bg-soft-ivory border border-champagne-gold/30 rounded-sm space-y-3.5 animate-fade-in">
              <div className="flex justify-between items-center border-b border-taupe/20 pb-2">
                <span className="text-[0.72rem] tracking-luxury uppercase font-semibold text-antique-brown">
                  Bespoke Body Measurements (Inches)
                </span>
                <span className="text-[0.65rem] text-taupe">Provide your exact dimensions</span>
              </div>

              {isBlouse ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[0.65rem] tracking-wider uppercase text-taupe mb-1">Bust (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 36"
                      value={measurements.bust}
                      onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
                      className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-wider uppercase text-taupe mb-1">Upper Waist (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 30"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-wider uppercase text-taupe mb-1">Shoulder (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 14.5"
                      value={measurements.shoulder}
                      onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                      className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-wider uppercase text-taupe mb-1">Blouse Length (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 14"
                      value={measurements.blouseLength}
                      onChange={(e) => setMeasurements({ ...measurements, blouseLength: e.target.value })}
                      className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[0.65rem] tracking-wider uppercase text-taupe mb-1">Bust (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 38"
                      value={measurements.bust}
                      onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
                      className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-wider uppercase text-taupe mb-1">Waist (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 32"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-wider uppercase text-taupe mb-1">Hip (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 40"
                      value={measurements.hip}
                      onChange={(e) => setMeasurements({ ...measurements, hip: e.target.value })}
                      className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-wider uppercase text-taupe mb-1">Kurta Length (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 44"
                      value={measurements.garmentLength}
                      onChange={(e) => setMeasurements({ ...measurements, garmentLength: e.target.value })}
                      className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[0.65rem] tracking-wider uppercase text-taupe mb-1">
                  Tailoring &amp; Fitting Instructions:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Keep 2 inches margin inside, Sweetheart neck cut with piping"
                  value={fittingNotes}
                  onChange={(e) => setFittingNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-taupe/30 text-xs focus:outline-antique-brown"
                />
              </div>
            </div>
          )}

          {/* E. Quantity Controls */}
          <div>
            <label className="text-[0.72rem] tracking-widest uppercase font-semibold text-espresso block mb-2">
              E. Quantity:
            </label>
            <div className="inline-flex items-center border border-taupe/30 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center hover:bg-taupe/20 text-base font-bold text-espresso transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-semibold text-espresso">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-9 h-9 flex items-center justify-center hover:bg-taupe/20 text-base font-bold text-espresso transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Breakdown Summary */}
          <div className="p-3.5 bg-champagne-beige/20 border border-taupe/20 rounded-sm space-y-1.5 text-xs">
            <div className="flex justify-between text-taupe">
              <span>Base Price:</span>
              <span>₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            {stitchingCharge > 0 && (
              <div className="flex justify-between text-antique-brown font-semibold">
                <span>Stitching Service ({stitchingOption}):</span>
                <span>+₹{stitchingCharge.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-taupe">
              <span>Quantity:</span>
              <span>&times; {quantity}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-taupe/20 text-sm font-serif font-bold text-espresso">
              <span>Final Configuration Subtotal:</span>
              <span className="text-antique-brown text-base">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-medium rounded-sm">
              {errorMsg}
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-espresso text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-antique-brown transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>CONFIRM CONFIGURATION &amp; ADD TO BAG</span>
              <span>&rarr;</span>
            </button>
          </div>
        </form>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="absolute inset-0 z-50 bg-espresso/90 flex flex-col items-center justify-center p-6 text-soft-ivory animate-fade-in">
            <div className="w-12 h-12 rounded-full border border-champagne-gold flex items-center justify-center text-champagne-gold text-2xl mb-3">
              &#10003;
            </div>
            <p className="font-serif text-xl tracking-wide">Added to Your Shopping Bag</p>
            <p className="text-xs text-warm-ivory/80 mt-1">Preserving your bespoke choices...</p>
          </div>
        )}
      </div>
    </div>
  );
}
