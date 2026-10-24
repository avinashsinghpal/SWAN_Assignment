/**
 * AnimatedNoise - canvas overlay inside the hero that generates
 * random grayscale noise every 2 frames. Pauses when hero is out
 * of view or when prefers-reduced-motion is set.
 */
import { useEffect, useRef } from 'react';

export function AnimatedNoise() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const visibleRef = useRef(true);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;

    // Half-resolution for performance
    function resize() {
      canvas.width = Math.floor(parent.offsetWidth / 2);
      canvas.height = Math.floor(parent.offsetHeight / 2);
    }
    resize();

    const ctx = canvas.getContext('2d');

    function draw() {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      frameRef.current += 1;
      if (frameRef.current % 2 === 0) {
        const w = canvas.width;
        const h = canvas.height;
        if (w > 0 && h > 0) {
          const imageData = ctx.createImageData(w, h);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const v = (Math.random() * 255) | 0;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 255;
          }
          ctx.putImageData(imageData, 0, 0);
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    // IntersectionObserver to pause when hero is out of view
    const obs = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (parent) obs.observe(parent);

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(rafRef.current);
      obs.disconnect();
      ro.disconnect();
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="lp-hero-noise"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity: 0.03,
        zIndex: 2,
      }}
    />
  );
}
