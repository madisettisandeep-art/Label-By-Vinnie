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
  lerpFactor = 0.28,
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
  const lastSeekTimestampRef = useRef(0);
  const isMobileRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const cachedViewportHeightRef = useRef(0);

  // Detect mobile & prefers-reduced-motion
  useEffect(() => {
    isMobileRef.current =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

    cachedViewportHeightRef.current = window.innerHeight || document.documentElement.clientHeight;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mql.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mql.addEventListener('change', handleMotionChange);
    return () => mql.removeEventListener('change', handleMotionChange);
  }, []);

  // IntersectionObserver to halt GPU / decoding loops when hero is scrolled past
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0, rootMargin: '80px 0px 80px 0px' }
    );

    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef]);

  // Synchronize scroll progress calculations with address-bar stability
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || cachedViewportHeightRef.current;
    const maxScroll = trackRef.current.offsetHeight - vh;
    if (maxScroll <= 0) return;

    const scrolled = -rect.top;
    const normProgress = Math.min(Math.max(scrolled / maxScroll, 0), 1);

    setProgress(normProgress);
    targetTimeRef.current = normProgress * duration;

    // Synchronize 3 Story Stages
    if (normProgress <= 0.35) {
      setCurrentStage(1);
    } else if (normProgress > 0.35 && normProgress <= 0.70) {
      setCurrentStage(2);
    } else {
      setCurrentStage(3);
    }
  }, [trackRef, duration]);

  // Event listeners for scroll, touchmove, wheel, resize, and orientationchange
  useEffect(() => {
    const onScrollOrTouch = () => {
      if (isVisibleRef.current) handleScroll();
    };

    const onResizeOrOrientation = () => {
      isMobileRef.current =
        window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      cachedViewportHeightRef.current = window.innerHeight || document.documentElement.clientHeight;
      handleScroll();
    };

    window.addEventListener('scroll', onScrollOrTouch, { passive: true });
    window.addEventListener('touchmove', onScrollOrTouch, { passive: true });
    window.addEventListener('wheel', onScrollOrTouch, { passive: true });
    window.addEventListener('resize', onResizeOrOrientation, { passive: true });
    window.addEventListener('orientationchange', onResizeOrOrientation, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollOrTouch);
      window.removeEventListener('touchmove', onScrollOrTouch);
      window.removeEventListener('wheel', onScrollOrTouch);
      window.removeEventListener('resize', onResizeOrOrientation);
      window.removeEventListener('orientationchange', onResizeOrOrientation);
    };
  }, [handleScroll]);

  // Scrubbing Animation Loop with Hardware Seek Protection & Anti-Freezing Watchdog
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict non-autoplay enforcement: video must follow scroll progress ONLY
    video.pause();

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
    video.addEventListener('canplay', onLoaded);
    video.addEventListener('error', onError);
    video.addEventListener('seeking', onSeeking);
    video.addEventListener('seeked', onSeeked);

    if (video.readyState >= 1) {
      setIsVideoLoaded(true);
      video.pause();
    }

    const animate = (timestamp: number) => {
      if (video && video.readyState >= 1 && isVisibleRef.current && !prefersReducedMotionRef.current) {
        // Enforce pause if browser attempted background auto-play
        if (!video.paused) {
          video.pause();
        }

        const diff = targetTimeRef.current - video.currentTime;
        const absDiff = Math.abs(diff);

        // Anti-freezing watchdog: if seeking event is stuck > 130ms, release seeking lock
        if (isSeekingRef.current && timestamp - lastSeekTimestampRef.current > 130) {
          isSeekingRef.current = false;
        }

        // Adaptive frame intervals: 16ms desktop, 28ms mobile
        const minSeekInterval = isMobileRef.current ? 28 : 16;
        const timeSinceLastSeek = timestamp - lastSeekTimestampRef.current;

        // Deadband threshold: 0.025s (sub-frame threshold at 24fps)
        if (absDiff > 0.025 && !isSeekingRef.current && timeSinceLastSeek >= minSeekInterval) {
          lastSeekTimestampRef.current = timestamp;

          // Adaptive dynamic step:
          // For small adjustments, take responsive steps (0.35)
          // For rapid multi-second scrolls, scale step to stay tightly locked to touch/scroll
          const factor = absDiff > 1.2 ? 0.50 : absDiff > 0.4 ? 0.38 : 0.28;
          let step = diff * factor;

          // Ensure minimum quantum of 1 frame (0.0416s) so seek operations actually produce a visible frame update
          if (Math.abs(step) < 0.038) {
            step = diff > 0 ? Math.min(diff, 0.041) : Math.max(diff, -0.041);
          }

          const nextTime = Math.min(Math.max(video.currentTime + step, 0), duration);

          try {
            video.currentTime = nextTime;
          } catch {
            // Suppress intermittent browser seek interruptions during fast direction changes
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
      video.removeEventListener('canplay', onLoaded);
      video.removeEventListener('error', onError);
      video.removeEventListener('seeking', onSeeking);
      video.removeEventListener('seeked', onSeeked);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [videoRef, duration]);

  return {
    progress,
    currentStage,
    currentTimeDisplay,
    isVideoLoaded,
    hasError,
  };
}