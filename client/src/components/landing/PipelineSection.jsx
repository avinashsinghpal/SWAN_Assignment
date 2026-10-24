/**
 * PipelineSection - Horizontally scrolling pipeline stage cards
 * with cursor follower, GSAP slide-in animations.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PIPELINE_CARDS = [
  {
    no: '01',
    tag: 'Intake',
    title: 'New',
    text: 'A fresh enquiry enters the system with contact details, company, and the service they want.',
  },
  {
    no: '02',
    tag: 'Outreach',
    title: 'Contacted',
    text: 'First outreach is logged and a follow-up date is set, so nothing goes quiet.',
  },
  {
    no: '03',
    tag: 'Vetted',
    title: 'Qualified',
    text: 'Need, budget, and timing are confirmed. This lead is worth pursuing.',
  },
  {
    no: '04',
    tag: 'Won',
    title: 'Converted',
    text: 'The deal is closed. Conversion rate is tracked across your entire pipeline.',
  },
  {
    no: '05',
    tag: 'Closed',
    title: 'Lost',
    text: 'Closed without a deal. Kept on record for reporting and future review.',
  },
];

export function PipelineSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const cursorRef = useRef(null);
  const isInsideRef = useRef(false);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Detect touch device
  const isTouch =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Header slide in
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards slide in with stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            delay: i * 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  // Cursor follower
  useEffect(() => {
    if (isTouch || prefersReduced) return;

    const section = sectionRef.current;
    const cursor = cursorRef.current;
    if (!section || !cursor) return;

    function onEnter() {
      isInsideRef.current = true;
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    }

    function onLeave() {
      isInsideRef.current = false;
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
    }

    function onMove(e) {
      if (!isInsideRef.current) return;
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out',
      });
    }

    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousemove', onMove);

    return () => {
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousemove', onMove);
    };
  }, [isTouch, prefersReduced]);

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="lp-section"
      style={{ overflow: 'hidden' }}
    >
      {/* Cursor follower - only rendered on non-touch */}
      {!isTouch && (
        <div
          ref={cursorRef}
          className="lp-cursor-follower"
          aria-hidden="true"
        />
      )}

      <div className="lp-shell">
        {/* Section header */}
        <div ref={headerRef} style={{ marginBottom: '3rem' }}>
          <span className="lp-eyebrow">01 / Pipeline</span>
          <h2 className="lp-heading">The Pipeline</h2>
        </div>

        {/* Horizontal scrolling cards */}
        <div className="lp-pipeline-scroll" role="list" aria-label="Lead pipeline stages">
          {PIPELINE_CARDS.map((card, i) => (
            <article
              key={card.no}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="lp-pipeline-card"
              role="listitem"
            >
              {/* Offset shadow layer */}
              <span className="lp-card-shadow-offset" aria-hidden="true" />

              {/* Top row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '1.5rem',
                }}
              >
                <span className="lp-meta">No. {card.no}</span>
                <span className="lp-meta" style={{ opacity: 0.6 }}>{card.tag}</span>
              </div>

              {/* Title */}
              <div className="lp-pipeline-card-title">{card.title}</div>

              {/* Divider */}
              <div className="lp-pipeline-card-divider" />

              {/* Description */}
              <p className="lp-body">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
