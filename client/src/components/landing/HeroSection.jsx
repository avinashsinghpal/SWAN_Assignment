/**
 * HeroSection - Full-height hero with split-flap headline,
 * scroll-driven fade-up, animated noise, and CTA buttons.
 * @param {{ isAuthenticated: boolean }} props
 */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AnimatedNoise } from './AnimatedNoise.jsx';
import { SplitFlapText } from './SplitFlapText.jsx';
import { ScrambleText } from './ScrambleText.jsx';
import { BitmapChevron } from './BitmapChevron.jsx';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection({ isAuthenticated }) {
  const contentRef = useRef(null);
  const sectionRef = useRef(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Scroll: content block moves up and fades out as hero scrolls away
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatedNoise />

      {/* Vertical brand label at far left - desktop only */}
      <span
        className="lp-vertical-label"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '1.2rem',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'center center',
          whiteSpace: 'nowrap',
          display: 'none',
        }}
        id="hero-brand-label"
      >
        SWAN DIGITAL
      </span>
      <style>{`@media (min-width: 768px) { #hero-brand-label { display: block !important; } }`}</style>
      {/* Main content block */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          paddingLeft: 'clamp(1.5rem, 7vw, 7rem)',
          paddingRight: '1.5rem',
          width: '100%',
        }}
      >
        {/* Split-flap display */}
        <SplitFlapText word="PIPELINE" />

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--lp-font-display)',
            fontSize: 'clamp(1rem, 3vw, 2rem)',
            color: 'rgba(238, 238, 238, 0.6)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginTop: '1rem',
            lineHeight: 1.2,
          }}
        >
          Lead Management, Built for Growth Teams
        </p>

        {/* Body copy */}
        <p
          className="lp-body"
          style={{ maxWidth: '28rem', marginTop: '3rem' }}
        >
          Capture every enquiry, move it through a clear pipeline, and never
          miss a follow-up. One workspace for your sales and marketing leads.
        </p>

        {/* Action row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '4rem',
            flexWrap: 'wrap',
          }}
        >
          {isAuthenticated ? (
            <Link to="/dashboard" className="lp-btn-primary">
              <ScrambleText>Open Dashboard</ScrambleText>
              <BitmapChevron />
            </Link>
          ) : (
            <>
              <Link to="/register" className="lp-btn-primary" aria-label="Get started with Swan LMS">
                <ScrambleText>Get Started</ScrambleText>
                <BitmapChevron />
              </Link>
              <Link to="/login" className="lp-text-link" aria-label="Log in to Swan LMS">
                Log In
              </Link>
            </>
          )}
        </div>

        {/* Floating tag */}
        <div
          style={{
            position: 'absolute',
            bottom: '-40vh',
            right: '2rem',
          }}
        >
          <span
            className="lp-meta"
            style={{
              display: 'inline-block',
              border: '1px solid rgba(34,34,34,0.8)',
              padding: '0.5rem 0.75rem',
            }}
          >
            v1.0 / Swan Digital Solutions
          </span>
        </div>
      </div>
    </section>
  );
}
