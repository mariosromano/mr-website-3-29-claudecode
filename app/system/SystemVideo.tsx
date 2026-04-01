'use client';

import { useEffect, useRef, useState } from 'react';

interface SystemVideoProps {
  src: string;
}

export default function SystemVideo({ src }: SystemVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked — that's fine
      });
    }
  }, [isVisible]);

  return (
    <div ref={containerRef} className="system-hero-video">
      {isVisible && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          aria-label="InterlockPanel installation demo showing CNC-carved Corian panels connecting"
        />
      )}
    </div>
  );
}
