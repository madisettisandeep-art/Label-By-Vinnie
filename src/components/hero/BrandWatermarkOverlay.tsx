'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface BrandWatermarkOverlayProps {
  containerRef: React.RefObject<HTMLElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoAspectRatio?: number; // default 16 / 9 (1.7778)
}

interface VideoLayout {
  renderWidth: number;
  renderHeight: number;
  offsetX: number;
  offsetY: number;
  containerWidth: number;
  containerHeight: number;
}

/**
 * BrandWatermarkOverlay
 * 
 * Securely and elegantly covers the Google Flow watermark in the bottom-right corner
 * of the 30-second hero fashion animation.
 * 
 * Mathematical Implementation:
 * - Synchronizes with the video element's displayed bounding box calculated from
 *   its object-cover object-center geometry.
 * - Anchors to the video's coordinate system so that the watermark is completely
 *   obscured across all responsive viewports (360x800 mobile up to 4K ultrawide desktop).
 * - Implements boundary clamping so the logo is never clipped off-screen by overflow:hidden.
 * - Remains persistently visible from the initial frame (00:00) to the final frame (00:30),
 *   regardless of scroll position, velocity, or direction.
 */
export function BrandWatermarkOverlay({
  containerRef,
  videoRef,
  videoAspectRatio = 16 / 9,
}: BrandWatermarkOverlayProps) {
  const [layout, setLayout] = useState<VideoLayout | null>(null);

  const calculateVideoRenderRect = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    if (cw <= 0 || ch <= 0) return;

    const video = videoRef.current;
    const nativeAspect =
      video && video.videoWidth > 0 && video.videoHeight > 0
        ? video.videoWidth / video.videoHeight
        : videoAspectRatio;

    const containerAspect = cw / ch;

    let renderWidth = cw;
    let renderHeight = ch;
    let offsetX = 0;
    let offsetY = 0;

    if (containerAspect > nativeAspect) {
      // Container is wider than video (desktop/ultrawide):
      // Video fills width, cropped top & bottom
      renderWidth = cw;
      renderHeight = cw / nativeAspect;
      offsetX = 0;
      offsetY = (ch - renderHeight) / 2;
    } else {
      // Container is taller than video (mobile portrait, tablets):
      // Video fills height, cropped left & right
      renderHeight = ch;
      renderWidth = ch * nativeAspect;
      offsetY = 0;
      offsetX = (cw - renderWidth) / 2;
    }

    setLayout({
      renderWidth,
      renderHeight,
      offsetX,
      offsetY,
      containerWidth: cw,
      containerHeight: ch,
    });
  }, [containerRef, videoRef, videoAspectRatio]);

  useEffect(() => {
    calculateVideoRenderRect();

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', calculateVideoRenderRect);
    }

    window.addEventListener('resize', calculateVideoRenderRect, { passive: true });
    window.addEventListener('orientationchange', calculateVideoRenderRect, { passive: true });

    // ResizeObserver for zero-lag container size tracking
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        calculateVideoRenderRect();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', calculateVideoRenderRect);
      }
      window.removeEventListener('resize', calculateVideoRenderRect);
      window.removeEventListener('orientationchange', calculateVideoRenderRect);
      if (ro) ro.disconnect();
    };
  }, [calculateVideoRenderRect, containerRef, videoRef]);

  // Fallback defaults prior to mount
  const cw = layout?.containerWidth ?? 1200;
  const ch = layout?.containerHeight ?? 800;
  const rw = layout?.renderWidth ?? cw;
  const rh = layout?.renderHeight ?? ch;
  const ox = layout?.offsetX ?? 0;
  const oy = layout?.offsetY ?? 0;

  // Badge dimensions matching luxury proportions
  const isMobile = cw < 640;
  const isTablet = cw >= 640 && cw < 1024;
  const badgeWidth = isMobile ? 168 : isTablet ? 195 : 224;
  const badgeHeight = isMobile ? 36 : isTablet ? 42 : 46;
  const marginX = isMobile ? 12 : 24;
  const marginY = isMobile ? 10 : 20;

  // The Google Flow watermark is burnt into the bottom-right corner of the 16:9 video frame
  // Position in container coordinates:
  const targetX = ox + rw - badgeWidth - marginX;
  const targetY = oy + rh - badgeHeight - marginY;

  // Clamping to visible container viewport so the logo is ALWAYS fully visible and never clipped:
  const clampedX = Math.max(marginX, Math.min(targetX, cw - badgeWidth - marginX));
  const clampedY = Math.max(marginY, Math.min(targetY, ch - badgeHeight - marginY));

  return (
    <div
      className="absolute inset-0 pointer-events-none z-40 overflow-hidden"
      aria-hidden="true"
    >
      {/* 
        Persistent Brand Watermark Cover:
        Anchored to the video's bottom-right coordinate space and clamped to visible screen.
        Completely obscures the Google Flow watermark from frame 00:00 to frame 00:30.
      */}
      <div
        className="absolute flex items-center gap-2.5 sm:gap-3 bg-[#140D09] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-tl-xl sm:rounded-tl-2xl rounded-br-sm border-t border-l border-champagne-gold/70 shadow-[0_4px_24px_rgba(0,0,0,0.85)] transition-all duration-150 select-none"
        style={{
          transform: `translate3d(${clampedX}px, ${clampedY}px, 0)`,
          width: `${badgeWidth}px`,
          height: `${badgeHeight}px`,
        }}
      >
        {/* Official Atelier Monogram Seal */}
        <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-champagne-gold shrink-0 bg-[#1D140E]">
          <Image
            src="/assets/brand/logo.jpg"
            alt="Label By Vinnie Atelier"
            fill
            sizes="32px"
            className="object-cover"
            priority
          />
        </div>

        {/* Brand Typographic Lockup */}
        <div className="flex flex-col min-w-0">
          <span className="font-serif text-[0.68rem] sm:text-[0.76rem] tracking-[0.24em] uppercase text-soft-ivory font-semibold truncate leading-tight">
            LABEL BY VINNIE
          </span>
          <span className="text-[0.52rem] sm:text-[0.58rem] tracking-[0.18em] uppercase text-champagne-gold/90 font-medium truncate leading-none mt-0.5">
            HAUTE ATELIER
          </span>
        </div>
      </div>
    </div>
  );
}