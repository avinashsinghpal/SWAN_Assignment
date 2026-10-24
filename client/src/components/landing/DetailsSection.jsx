/**
 * DetailsSection - CTA block + footer grid columns.
 * @param {{ isAuthenticated: boolean }} props
 */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { HighlightText } from './HighlightText.jsx';
import { ScrambleText } from './ScrambleText.jsx';
import { BitmapChevron } from './BitmapChevron.jsx';

gsap.registerPlugin(ScrollTrigger);

const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    items: [
      { label: 'Lead Management', href: null },
      { label: 'Dashboard', href: null },
      { label: 'Reports', href: null },
    ],
  },
  {
    heading: 'Roles',
    items: [
      { label: 'Admin', href: null },
      { label: 'Sales', href: null },
    ],
  },
  {
    heading: 'Stack',
    items: [
      { label: 'React', href: null },
      { label: 'Express', href: null },
      { label: 'MongoDB', href: null },
    ],
  },
  {
    heading: 'Access',
    items: [
      { label: 'Log In', href: '/login' },
      { label: 'Register', href: '/register' },
    ],
  },
  {
    heading: 'Contact',
    items: [
      { label: 'Email', href: 'mailto:hello@swandigital.io' },
      { label: 'LinkedIn', href: 'https://linkedin.com' },
    ],
  },
  {
    heading: 'Year',
    items: [
      { label: '2026', href: null },
      { label: 'Live', href: null },
    ],
  },
];

export function DetailsSection({ isAuthenticated }) {
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);
  const columnsRef = useRef([]);
  const footerRef = useRef(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // CTA block
      gsap.fromTo(
        ctaRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Footer columns stagger
      columnsRef.current.forEach((col, i) => {
        if (!col) return;
        gsap.fromTo(
          col,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: col,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Footer row fade up
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="details"
      ref={sectionRef}
      className="lp-section"
      style={{
        borderTop: '1px solid rgba(34, 34, 34, 0.3)',
      }}
    >
      <div className="lp-shell">
        <span className="lp-eyebrow">04 / Details</span>
        <h2 className="lp-heading">Start Now</h2>

        {/* CTA block */}
        <div ref={ctaRef} style={{ marginTop: '4rem', marginBottom: '6rem' }}>
          <p
            style={{
              fontFamily: 'var(--lp-font-display)',
              fontSize: 'clamp(2.5rem, 8vw, 8rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              color: 'var(--lp-fg)',
              margin: 0,
            }}
          >
            Manage{' '}
            <HighlightText parallaxSpeed={0.4}>Every Lead</HighlightText>
          </p>

          <p className="lp-body" style={{ marginTop: '1.5rem', maxWidth: '28rem' }}>
            Create an account and start tracking leads in minutes.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              marginTop: '2rem',
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
                <Link to="/register" className="lp-btn-primary">
                  <ScrambleText>Create Account</ScrambleText>
                  <BitmapChevron />
                </Link>
                <Link to="/login" className="lp-text-link">
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Footer column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem 3rem',
          }}
          id="details-grid"
        >
          <style>{`
            @media (min-width: 768px) {
              #details-grid { grid-template-columns: repeat(4, 1fr); }
            }
            @media (min-width: 1024px) {
              #details-grid { grid-template-columns: repeat(6, 1fr); }
            }
          `}</style>

          {FOOTER_COLUMNS.map((col, i) => (
            <div
              key={col.heading}
              ref={(el) => { columnsRef.current[i] = el; }}
            >
              <p
                style={{
                  fontFamily: 'var(--lp-font-mono)',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  color: 'var(--lp-muted-fg)',
                  marginBottom: '1rem',
                  margin: '0 0 1rem 0',
                }}
              >
                {col.heading}
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="lp-footer-link"
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span
                        style={{
                          color: 'rgba(238, 238, 238, 0.8)',
                          fontFamily: 'var(--lp-font-mono)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer row */}
        <div
          ref={footerRef}
          style={{
            marginTop: '6rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(34, 34, 34, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
          id="footer-row"
        >
          <style>{`
            @media (min-width: 768px) {
              #footer-row {
                flex-direction: row !important;
                justify-content: space-between;
                align-items: center;
              }
            }
          `}</style>
          <p className="lp-meta">
            (c) 2026 Swan Digital Solutions. All rights reserved.
          </p>
          <p className="lp-meta">Built for teams that follow up.</p>
        </div>
      </div>
    </section>
  );
}
