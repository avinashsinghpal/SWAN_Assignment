/**
 * ScrambleTextOnHover - scrambles button text on hover, locking
 * characters left-to-right over ~0.6s using GSAP.
 * @param {{ children: string, className?: string, tag?: string }} props
 */
import { useRef, useCallback } from 'react';
import gsap from 'gsap';

const GLYPHS = '!@#$%^&*()_+-=<>?/[]{}Xx';

export function ScrambleText({ children, className = '', tag: Tag = 'span' }) {
  const textRef = useRef(null);
  const animRef = useRef(null);
  const original = typeof children === 'string' ? children : String(children);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scramble = useCallback(() => {
    if (prefersReduced) return;
    const el = textRef.current;
    if (!el) return;

    if (animRef.current) {
      animRef.current.kill();
    }

    const chars = original.split('');
    const locked = new Array(chars.length).fill(false);
    let progress = 0;

    animRef.current = gsap.to(
      { progress: 0 },
      {
        progress: 1,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate() {
          progress = this.targets()[0].progress;
          const lockCount = Math.floor(progress * chars.length);

          const result = chars.map((ch, i) => {
            if (i < lockCount) {
              locked[i] = true;
              return ch;
            }
            if (locked[i]) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          });

          el.textContent = result.join('');
        },
        onComplete() {
          el.textContent = original;
        },
      }
    );
  }, [original, prefersReduced]);

  const reset = useCallback(() => {
    if (prefersReduced) return;
    if (animRef.current) {
      animRef.current.kill();
    }
    const el = textRef.current;
    if (el) el.textContent = original;
  }, [original, prefersReduced]);

  return (
    <Tag
      ref={textRef}
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={reset}
    >
      {original}
    </Tag>
  );
}

export const ScrambleTextOnHover = ScrambleText;
