/**
 * HighlightText - wraps a word in an orange block that animates in
 * via ScrollTrigger when the word reaches 80% of the viewport.
 * @param {{ children: string, parallaxSpeed?: number }} props
 */
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HighlightText({ children, parallaxSpeed = 0.6, animateOnMount = false, className = '' }) {
  const containerRef = useRef(null);
  const barRef = useRef(null);
  const textRef = useRef(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const bar = barRef.current;
    const txt = textRef.current;
    if (!bar || !txt) return;

    if (prefersReduced) {
      bar.style.transform = 'scaleX(1)';
      txt.style.color = '#020202';
      return;
    }

    const ctx = gsap.context(() => {
      if (animateOnMount) {
        const tl = gsap.timeline();
        tl.to(bar, {
          scaleX: 1,
          duration: 1.0,
          ease: 'power3.out',
        }).to(
          txt,
          {
            color: '#020202',
            duration: 0.5,
            ease: 'none',
          },
          0.3
        );
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top -20%',
            toggleActions: 'play reverse play reverse',
          },
        });

        tl.to(bar, {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.out',
        }).to(
          txt,
          {
            color: '#020202',
            duration: 0.6,
            ease: 'none',
          },
          0.5
        );

        // Subtle parallax on the bar
        gsap.to(bar, {
          yPercent: -20 * parallaxSpeed,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [parallaxSpeed, prefersReduced, animateOnMount]);

  return (
    <span ref={containerRef} className={`lp-highlight ${className}`}>
      <span ref={barRef} className="lp-highlight-bar" />
      <span ref={textRef} className="lp-highlight-text">
        {children}
      </span>
    </span>
  );
}
