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
  lerpFactor = 0.05,
}: UseScrollVideoProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('00:00');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const targetTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Scroll listener
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const maxScroll = trackRef.current.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;

    const normProgress = Math.min(Math.max(scrolled / maxScroll, 0), 1);
    setProgress(normProgress);
    targetTimeRef.current = normProgress * duration;

    // Synchronize 3 Story Stages
    // Stage 1: 0.00 - 0.33 (0s - 10s)
    // Stage 2: 0.33 - 0.66 (10s - 20s)
    // Stage 3: 0.66 - 1.00 (20s - 30s)
    if (normProgress <= 0.33) {
      setCurrentStage(1);
    } else if (normProgress > 0.33 && normProgress <= 0.66) {
      setCurrentStage(2);
    } else {
      setCurrentStage(3);
    }
  }, [trackRef, duration]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Video Scrubbing Animation Loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setIsVideoLoaded(true);
      video.pause();
    };

    video.addEventListener('loadedmetadata', onLoaded);
    if (video.readyState >= 1) {
      setIsVideoLoaded(true);
    }

    const animate = () => {
      if (video && video.readyState >= 1) {
        const diff = targetTimeRef.current - video.currentTime;
        // Avoid micro-jitter by updating when delta > 0.035s
        if (Math.abs(diff) > 0.035) {
          video.currentTime += diff * lerpFactor;
        }

        const cur = Math.floor(video.currentTime);
        const s = cur < 10 ? `0${cur}` : `${cur}`;
        setCurrentTimeDisplay(`00:${s}`);
      }
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [videoRef, lerpFactor]);

  return {
    progress,
    currentStage,
    currentTimeDisplay,
    isVideoLoaded,
  };
}
