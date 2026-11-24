'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollVideoProps {
  duration?: number;
  trackRef: React.RefObject<HTMLElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  lerpFactor?: number;
}

export function useScrollVideo({
  duration = 30.0,
  trackRef,
  videoRef,
  lerpFactor = 0.08,
}: UseScrollVideoProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('00:00');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const isVisibleRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);
  const lastSeekTimeRef = useRef(0);
  const isMobileRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // Check device capabilities and user accessibility preferences
  useEffect(() => {
    isMobileRef.current =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mql.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mql.addEventListener('change', handleMotionChange);
    return () => mql.removeEventListener('change', handleMotionChange);
  }, []);

  // IntersectionObserver to avoid rendering/scrubbing when out of viewport
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0, rootMargin: '100px 0px 100px 0px' }
    );

    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef]);

  // Synchronize scroll progress calculations with mobile viewport dynamics
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const maxScroll = trackRef.current.offsetHeight - viewportHeight;
    if (maxScroll <= 0) return;

    const scrolled = -rect.top;
    const normProgress = Math.min(Math.max(scrolled / maxScroll, 0), 1);

    setProgress(normProgress);
    targetTimeRef.current = normProgress * duration;

    // Synchronize 3 Story Stages
    if (normProgress <= 0.33) {
      setCurrentStage(1);
    } else if (normProgress > 0.33 && normProgress <= 0.66) {
      setCurrentStage(2);
    } else {
      setCurrentStage(3);
    }
  }, [trackRef, duration]);

  // Event listeners for scroll, touchmove, resize, and orientationchange
  useEffect(() => {
    const onScrollOrTouch = () => {
      if (isVisibleRef.current) handleScroll();
    };

    const onResizeOrOrientation = () => {
      isMobileRef.current =
        window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      handleScroll();
    };

    window.addEventListener('scroll', onScrollOrTouch, { passive: true });
    window.addEventListener('touchmove', onScrollOrTouch, { passive: true });
    window.addEventListener('resize', onResizeOrOrientation, { passive: true });
    window.addEventListener('orientationchange', onResizeOrOrientation, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollOrTouch);
      window.removeEventListener('touchmove', onScrollOrTouch);
      window.removeEventListener('resize', onResizeOrOrientation);
      window.removeEventListener('orientationchange', onResizeOrOrientation);
    };
  }, [handleScroll]);

  // Video Scrubbing Animation Loop with Hardware Seek Protection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setIsVideoLoaded(true);
      setHasError(false);
      video.pause();
    };

    const onError = () => {
      setHasError(true);
    };

    const onSeeking = () => {
      isSeekingRef.current = true;
    };

    const onSeeked = () => {
      isSeekingRef.current = false;
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('error', onError);
    video.addEventListener('seeking', onSeeking);
    video.addEventListener('seeked', onSeeked);

    if (video.readyState >= 1) {
      setIsVideoLoaded(true);
    }

    const animate = (timestamp: number) => {
      // Only process when visible on screen and reduced motion is disabled
      if (video && video.readyState >= 1 && isVisibleRef.current && !prefersReducedMotionRef.current) {
        const diff = targetTimeRef.current - video.currentTime;
        const absDiff = Math.abs(diff);

        // Mobile throttling to prevent decoder starvation
        const minInterval = isMobileRef.current ? 35 : 16;
        const timeSinceLastSeek = timestamp - lastSeekTimeRef.current;

        // Micro-jitter deadband: ignore changes < 0.04s
        if (absDiff > 0.04 && !isSeekingRef.current && timeSinceLastSeek >= minInterval) {
          lastSeekTimeRef.current = timestamp;

          // Adaptive lerp: on mobile during rapid scroll, take larger steps to stay in sync
          const effectiveLerp = isMobileRef.current
            ? Math.min(lerpFactor * 1.6, 0.25)
            : lerpFactor;

          const nextTime = Math.min(Math.max(video.currentTime + diff * effectiveLerp, 0), duration);

          try {
            if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
              (video as any).fastSeek(nextTime);
            } else {
              video.currentTime = nextTime;
            }
          } catch {
            // Ignore intermittent seek errors on fast scroll
          }

          const cur = Math.floor(video.currentTime);
          const s = cur < 10 ? `0${cur}` : `${cur}`;
          setCurrentTimeDisplay(`00:${s}`);
        }
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('error', onError);
      video.removeEventListener('seeking', onSeeking);
      video.removeEventListener('seeked', onSeeked);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [videoRef, lerpFactor, duration]);

  return {
    progress,
    currentStage,
    currentTimeDisplay,
    isVideoLoaded,
    hasError,
  };
}
