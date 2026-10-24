/**
 * CapabilitiesSection - Asymmetric bento grid of capability cards
 * with hover/active states and GSAP scroll entrances.
 */
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  {
    idx: '01',
    colSpan: 2,
    rowSpan: 2,
    medium: 'Core',
    title: 'Lead Management',
    text: 'Create, view, edit, and delete leads with contact details, company, service interest, status, notes, and follow-up dates.',
  },
  {
    idx: '02',
    colSpan: 1,
    rowSpan: 1,
    medium: 'Analytics',
    title: 'Dashboard',
    text: 'Live counts by status, conversion rate, and trend charts.',
  },
  {
    idx: '03',
    colSpan: 1,
    rowSpan: 2,
    medium: 'Discovery',
    title: 'Search and Filters',
    text: 'Search by name, email, or phone. Filter by status and date. Paginate large lists.',
  },
  {
    idx: '04',
    colSpan: 1,
    rowSpan: 1,
    medium: 'Reminders',
    title: 'Follow-ups',
    text: 'Overdue and upcoming follow-ups surfaced on your dashboard.',
  },
  {
    idx: '05',
    colSpan: 2,
    rowSpan: 1,
    medium: 'Audit Trail',
    title: 'Activity History',
    text: 'Every update and status change is recorded on a timeline for each lead.',
  },
  {
    idx: '06',
    colSpan: 1,
    rowSpan: 1,
    medium: 'Export',
    title: 'CSV Export',
    text: 'Download your filtered leads in one click.',
  },
];

export function CapabilitiesSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const [firstActive, setFirstActive] = useState(false);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Mark first card active when it reaches 80% of viewport
    const firstCard = cardsRef.current[0];
    if (!firstCard) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.8) {
          setFirstActive(true);
        }
      },
      { threshold: 0.8 }
    );
    obs.observe(firstCard);
    return () => obs.disconnect();
  }, []);

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

      // Cards fade up with stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section id="capabilities" ref={sectionRef} className="lp-section">
      <div className="lp-shell">
        {/* Header row */}
        <div
          ref={headerRef}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2rem',
            gap: '2rem',
          }}
        >
          <div>
            <span className="lp-eyebrow">02 / Capabilities</span>
            <h2 className="lp-heading">What You Get</h2>
          </div>
          <p
            className="lp-body"
            style={{
              display: 'none',
              maxWidth: '18rem',
              textAlign: 'right',
              marginTop: '1rem',
            }}
            // Shown only on md+ via inline style override below
            id="cap-subtitle"
          >
            Everything a sales team needs to capture, track, and close leads.
          </p>
        </div>

        {/* md+ subtitle via CSS */}
        <style>{`
          @media (min-width: 768px) {
            #cap-subtitle { display: block !important; }
          }
        `}</style>

        {/* Bento grid */}
        <div className="lp-cap-grid">
          {CAPABILITIES.map((cap, i) => {
            const isFirst = i === 0;
            const activeClass = isFirst && firstActive ? ' cap-active' : '';

            return (
              <article
                key={cap.idx}
                ref={(el) => { cardsRef.current[i] = el; }}
                className={`lp-cap-card${activeClass}`}
                style={{
                  gridColumn: `span ${cap.colSpan}`,
                  gridRow: `span ${cap.rowSpan}`,
                }}
                tabIndex={0}
              >
                <span className="lp-cap-card-bg" aria-hidden="true" />
                <span className="lp-cap-card-corner" aria-hidden="true" />

                <div>
                  <span className="lp-cap-card-label">{cap.medium}</span>
                  <div className="lp-cap-card-title">{cap.title}</div>
                  <p className="lp-cap-card-desc">{cap.text}</p>
                </div>

                <span className="lp-cap-card-idx">{cap.idx}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
