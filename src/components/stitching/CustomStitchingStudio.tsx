'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { generateStitchingEnquiryWhatsAppUrl } from '@/lib/whatsapp/generator';
import { CustomStitchingEnquiry } from '@/types';

export function CustomStitchingStudio() {
  const [isOpen, setIsOpen] = useState(false);
  const [garmentType, setGarmentType] = useState('Designer Blouse');
  const [fabricType, setFabricType] = useState('Pure Chanderi Silk');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [designNotes, setDesignNotes] = useState('');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  const [activeView, setActiveView] = useState<'split' | 'video1' | 'video2'>('split');
  const [muted1, setMuted1] = useState(true);
  const [muted2, setMuted2] = useState(true);
  const [feedback1, setFeedback1] = useState<string | null>(null);
  const [feedback2, setFeedback2] = useState<string | null>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const toggleAudio1 = () => {
    if (!video1Ref.current) return;
    const willUnmute = muted1;
    if (willUnmute) {
      if (video2Ref.current) {
        video2Ref.current.muted = true;
        setMuted2(true);
      }
      video1Ref.current.muted = false;
      video1Ref.current.play().catch(() => {});
      setMuted1(false);
      setFeedback1('Music Playing 🔊');
    } else {
      video1Ref.current.muted = true;
      setMuted1(true);
      setFeedback1('Muted 🔇');
    }
    setTimeout(() => setFeedback1(null), 1800);
  };

  const toggleAudio2 = () => {
    if (!video2Ref.current) return;
    const willUnmute = muted2;
    if (willUnmute) {
      if (video1Ref.current) {
        video1Ref.current.muted = true;
        setMuted1(true);
      }
      video2Ref.current.muted = false;
      video2Ref.current.play().catch(() => {});
      setMuted2(false);
      setFeedback2('Music Playing 🔊');
    } else {
      video2Ref.current.muted = true;
      setMuted2(true);
      setFeedback2('Muted 🔇');
    }
    setTimeout(() => setFeedback2(null), 1800);
  };

  const [measurements, setMeasurements] = useState({
    bust: 36,
    waist: 30,
    hip: 38,
    shoulder: 14,
    armhole: 16,
    sleeveLength: 10.5,
    garmentLength: 14.5,
    frontNeckDepth: 7,
    backNeckDepth: 8,
  });

  const handleMeasurementChange = (field: keyof typeof measurements, val: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: val === '' ? null : parseFloat(val),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ref = `STITCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const enquiry: CustomStitchingEnquiry = {
      id: crypto.randomUUID ? crypto.randomUUID() : ref,
      referenceNumber: ref,
      customerName: clientName,
      customerPhone: clientPhone,
      garmentType,
      fabricType,
      measurements: { ...measurements, unit },
      designNotes,
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('lbv_stitching') || '[]');
      existing.unshift(enquiry);
      localStorage.setItem('lbv_stitching', JSON.stringify(existing));
    } catch (err) {
      console.warn('Unable to store stitching enquiry locally', err);
    }

    const waUrl = generateStitchingEnquiryWhatsAppUrl(enquiry);
    setIsOpen(false);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="custom-stitching" className="py-28 bg-soft-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Studio Copy */}
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl text-espresso leading-tight mb-6 font-normal">
              CUSTOM STITCHING STUDIO
            </h2>
            <p className="text-base text-taupe leading-relaxed mb-8">
              Experience the pinnacle of personalised Indian couture. Every silhouette is cut and handcrafted by our master tailors to your exact measurements, with customized necklines, sleeve contours, and luxurious cotton silk linings.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4 items-start">
                <span className="text-champagne-gold font-bold">✓</span>
                <div>
                  <h4 className="text-sm font-semibold text-espresso">Single Weave Artisanry</h4>
                  <p className="text-xs text-taupe">Authentic Chanderi zari, Bandhani silk, and Mal cotton fabrics cut to measure.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-champagne-gold font-bold">✓</span>
                <div>
                  <h4 className="text-sm font-semibold text-espresso">Precision Hand-Anchored Cutwork</h4>
                  <p className="text-xs text-taupe">Hand mirror-work, delicate gold zari borders, and French seams.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-champagne-gold font-bold">✓</span>
                <div>
                  <h4 className="text-sm font-semibold text-espresso">Worldwide Doorstep Delivery</h4>
                  <p className="text-xs text-taupe">Bespoke orders packed in protective dust covers and shipped to India &amp; USA.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="mt-12 sm:mt-14 inline-block px-8 py-4 bg-antique-brown text-soft-ivory text-xs font-semibold tracking-luxury uppercase hover:bg-espresso transition-all shadow-xl border border-champagne-gold/30 hover:shadow-2xl"
            >
              LAUNCH CUSTOM MEASUREMENT STUDIO
            </button>
          </div>

          {/* Right: Atelier Video Showcase Card */}
          <div className="bg-white p-6 shadow-xl border border-taupe/15">
            {/* View Switcher Tabs */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setActiveView('split');
                  setTimeout(() => {
                    video1Ref.current?.play().catch(() => {});
                    video2Ref.current?.play().catch(() => {});
                  }, 50);
                }}
                className={`text-[0.7rem] uppercase tracking-luxury px-3.5 py-1.5 font-medium transition-all rounded-sm border ${
                  activeView === 'split'
                    ? 'bg-espresso text-soft-ivory border-espresso font-semibold shadow-sm'
                    : 'bg-warm-ivory text-espresso border-champagne-gold/30 hover:border-champagne-gold'
                }`}
              >
                Both
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView('video1');
                  setTimeout(() => {
                    video1Ref.current?.play().catch(() => {});
                  }, 50);
                }}
                className={`text-[0.7rem] uppercase tracking-luxury px-3.5 py-1.5 font-medium transition-all rounded-sm border ${
                  activeView === 'video1'
                    ? 'bg-espresso text-soft-ivory border-espresso font-semibold shadow-sm'
                    : 'bg-warm-ivory text-espresso border-champagne-gold/30 hover:border-champagne-gold'
                }`}
              >
                Potli Sleeves
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView('video2');
                  setTimeout(() => {
                    video2Ref.current?.play().catch(() => {});
                  }, 50);
                }}
                className={`text-[0.7rem] uppercase tracking-luxury px-3.5 py-1.5 font-medium transition-all rounded-sm border ${
                  activeView === 'video2'
                    ? 'bg-espresso text-soft-ivory border-espresso font-semibold shadow-sm'
                    : 'bg-warm-ivory text-espresso border-champagne-gold/30 hover:border-champagne-gold'
                }`}
              >
                Sweet Heart Neck
              </button>
            </div>

            {/* Video Box Container */}
            <div
              className={`relative h-[480px] w-full overflow-hidden mb-4 bg-espresso grid rounded transition-all duration-300 ${
                activeView === 'split'
                  ? 'grid-cols-2 gap-2'
                  : activeView === 'video1'
                  ? 'grid-cols-1'
                  : 'grid-cols-1'
              }`}
            >
              {/* Video 1: Potli Detailing */}
              {(activeView === 'split' || activeView === 'video1') && (
                <div
                  onClick={toggleAudio1}
                  className="relative w-full h-full overflow-hidden cursor-pointer group bg-black"
                  title="Tap to toggle music"
                >
                  <video
                    ref={video1Ref}
                    src="/videos/05_a_beautiful_navy_blue_designer_DfohqqltYqh.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />

                  {/* Audio Mute/Unmute Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio1();
                    }}
                    className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all shadow-lg ${
                      muted1
                        ? 'bg-espresso/80 text-soft-ivory/80 border-soft-ivory/30 hover:scale-110 hover:border-champagne-gold'
                        : 'bg-espresso/90 text-champagne-gold border-champagne-gold shadow-[0_0_15px_rgba(255,215,0,0.5)] scale-105'
                    }`}
                    title={muted1 ? 'Tap to unmute music' : 'Tap to mute music'}
                  >
                    {muted1 ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    )}
                  </button>

                  {/* Toast Feedback */}
                  {feedback1 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-espresso/90 text-soft-ivory text-xs px-4 py-2 rounded-full border border-champagne-gold/40 shadow-xl pointer-events-none animate-fade-in">
                      {feedback1}
                    </div>
                  )}

                  <span className="absolute bottom-3 left-3 z-10 bg-espresso/85 text-soft-ivory text-[0.6rem] tracking-luxury uppercase px-2.5 py-1 font-semibold border-l-2 border-champagne-gold">
                    LOOK 1: POTLI SLEEVES
                  </span>
                </div>
              )}

              {/* Video 2: Sweetheart Neckline */}
              {(activeView === 'split' || activeView === 'video2') && (
                <div
                  onClick={toggleAudio2}
                  className="relative w-full h-full overflow-hidden cursor-pointer group bg-black"
                  title="Tap to toggle music"
                >
                  <video
                    ref={video2Ref}
                    src="/videos/07_elegance_in_every_detail_DfXfzskzB_j.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />

                  {/* Audio Mute/Unmute Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio2();
                    }}
                    className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all shadow-lg ${
                      muted2
                        ? 'bg-espresso/80 text-soft-ivory/80 border-soft-ivory/30 hover:scale-110 hover:border-champagne-gold'
                        : 'bg-espresso/90 text-champagne-gold border-champagne-gold shadow-[0_0_15px_rgba(255,215,0,0.5)] scale-105'
                    }`}
                    title={muted2 ? 'Tap to unmute music' : 'Tap to mute music'}
                  >
                    {muted2 ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    )}
                  </button>

                  {/* Toast Feedback */}
                  {feedback2 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-espresso/90 text-soft-ivory text-xs px-4 py-2 rounded-full border border-champagne-gold/40 shadow-xl pointer-events-none animate-fade-in">
                      {feedback2}
                    </div>
                  )}

                  <span className="absolute bottom-3 left-3 z-10 bg-espresso/85 text-soft-ivory text-[0.6rem] tracking-luxury uppercase px-2.5 py-1 font-semibold border-l-2 border-champagne-gold">
                    LOOK 2: SWEETHEART NECK
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between mb-1">
              <h4 className="font-serif text-xl text-espresso">Bespoke Navy Blue Designer Blouse</h4>
              <span className="text-[0.65rem] tracking-luxury uppercase text-antique-brown font-semibold">
                2 REELS • AUTOPLAY
              </span>
            </div>
            <p className="text-xs text-taupe leading-relaxed">
              Dual artisanal showcase: Potli sleeve detailing &amp; sweetheart neckline with handcrafted latkan ties. Tap the audio icon or video card to mute/unmute original music.
            </p>
          </div>

        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-warm-ivory text-espresso p-8 shadow-2xl max-h-[92vh] overflow-y-auto animate-scale-up">
            
            <div className="flex justify-between items-center pb-4 border-b border-taupe/20 mb-6">
              <div>
                <h3 className="font-serif text-2xl tracking-wide">BESPOKE MEASUREMENT STUDIO</h3>
                <p className="text-xs text-taupe">Submit your tailored profile directly to designer Vinnie</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-3xl text-espresso hover:text-antique-brown leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.75rem] tracking-widest uppercase font-semibold mb-1">
                    Garment Silhouette *
                  </label>
                  <select
                    value={garmentType}
                    onChange={(e) => setGarmentType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-taupe/30 text-sm focus:outline-antique-brown"
                  >
                    <option value="Designer Blouse">Designer Blouse</option>
                    <option value="Bandhani Kurti & Palazzo Set">Bandhani Kurti &amp; Palazzo Set</option>
                    <option value="Banarasi Chanderi Suit">Banarasi Chanderi Suit</option>
                    <option value="Anarkali Ensemble">Anarkali Ensemble</option>
                    <option value="Lehenga Blouse">Lehenga Blouse</option>
                    <option value="Western Evening Gown">Western Evening Gown</option>
                    <option value="Custom Outfit">Other Custom Outfit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.75rem] tracking-widest uppercase font-semibold mb-1">
                    Fabric Option *
                  </label>
                  <select
                    value={fabricType}
                    onChange={(e) => setFabricType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-taupe/30 text-sm focus:outline-antique-brown"
                  >
                    <option value="Pure Chanderi Silk">Pure Chanderi Silk</option>
                    <option value="Authentic Bandhani">Authentic Bandhani</option>
                    <option value="Banarasi Zari Silk">Banarasi Zari Silk</option>
                    <option value="Raw Silk">Raw Silk</option>
                    <option value="Cotton Silk">Cotton Silk</option>
                    <option value="Customer Supplied Fabric">I will courier my own fabric</option>
                  </select>
                </div>
              </div>

              {/* Units switcher */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs uppercase tracking-luxury text-antique-brown font-semibold">
                  Measurements Studio
                </span>
                <div className="flex text-xs border border-taupe/30">
                  <button
                    type="button"
                    onClick={() => setUnit('inches')}
                    className={`px-3 py-1 ${unit === 'inches' ? 'bg-antique-brown text-soft-ivory' : 'bg-white text-espresso'}`}
                  >
                    Inches
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('cm')}
                    className={`px-3 py-1 ${unit === 'cm' ? 'bg-antique-brown text-soft-ivory' : 'bg-white text-espresso'}`}
                  >
                    Centimeters
                  </button>
                </div>
              </div>

              {/* Measurement inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(measurements).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-[0.68rem] tracking-widest uppercase font-semibold text-taupe mb-1 truncate">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={value ?? ''}
                      onChange={(e) => handleMeasurementChange(key as keyof typeof measurements, e.target.value)}
                      className="w-full p-2 bg-white border border-taupe/30 text-sm focus:outline-antique-brown"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[0.75rem] tracking-widest uppercase font-semibold mb-1">
                  Design Specifications &amp; Neckline Style
                </label>
                <textarea
                  rows={2}
                  value={designNotes}
                  onChange={(e) => setDesignNotes(e.target.value)}
                  placeholder="e.g. Deep back U-cut with gold zari potli buttons, elbow-length sleeves"
                  className="w-full p-3 bg-white border border-taupe/30 text-sm focus:outline-antique-brown"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.75rem] tracking-widest uppercase font-semibold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full p-3 bg-white border border-taupe/30 text-sm focus:outline-antique-brown"
                  />
                </div>
                <div>
                  <label className="block text-[0.75rem] tracking-widest uppercase font-semibold mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-white border border-taupe/30 text-sm focus:outline-antique-brown"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-antique-brown text-soft-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-espresso transition-all shadow-xl"
              >
                SUBMIT BESPOKE ENQUIRY VIA WHATSAPP
              </button>

              <p className="text-[0.72rem] text-taupe text-center leading-relaxed">
                No automated quotation promises. Vinnie will personally inspect your measurements and reply on WhatsApp.
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
