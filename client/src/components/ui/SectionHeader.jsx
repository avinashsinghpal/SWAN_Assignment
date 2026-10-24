import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { cn } from '../../lib/cn.js';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className = '',
  animate = true,
}) {
  const containerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!animate || prefersReduced || !containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, [animate, prefersReduced]);

  return (
    <header
      ref={containerRef}
      className={cn('flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#222222]/60 mb-8', className)}
    >
      <div className="space-y-2">
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FE6A00]">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-5xl md:text-7xl tracking-tight uppercase text-[#EEEEEE] leading-none m-0">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-xs md:text-sm text-[#717171] leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}
