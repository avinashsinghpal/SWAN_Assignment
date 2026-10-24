/**
 * WorkflowSection - Four large alternating workflow statements
 * with HighlightText parallax and GSAP slide-in entrances.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { HighlightText } from './HighlightText.jsx';

gsap.registerPlugin(ScrollTrigger);

const WORKFLOW_STEPS = [
  {
    annotation: '01 / Capture',
    pre: '',
    highlight: 'Capture',
    post: ' Every Lead',
    desc: 'Add enquiries in seconds with everything your team needs to reach out.',
    align: 'left',
  },
  {
    annotation: '02 / Pipeline',
    pre: '',
    highlight: 'Pipeline',
    post: ' Visibility',
    desc: 'See exactly where every lead stands, from first contact to closed deal.',
    align: 'right',
  },
  {
    annotation: '03 / Follow-up',
    pre: 'Never Miss A ',
    highlight: 'Follow-Up',
    post: '',
    desc: 'Dates and reminders keep every conversation moving at the right time.',
    align: 'left',
  },
  {
    annotation: '04 / Convert',
    pre: 'Measure What ',
    highlight: 'Converts',
    post: '',
    desc: 'Dashboards and exports turn lead data into decisions.',
    align: 'right',
  },
];

export function WorkflowSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const articlesRef = useRef([]);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Header
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

      // Articles slide in from their respective sides
      articlesRef.current.forEach((article, i) => {
        if (!article) return;
        const fromLeft = WORKFLOW_STEPS[i].align === 'left';
        gsap.fromTo(
          article,
          { x: fromLeft ? -80 : 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: article,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section id="workflow" ref={sectionRef} className="lp-section">
      <div className="lp-shell">
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: '6rem' }}>
          <span className="lp-eyebrow">03 / Workflow</span>
          <h2 className="lp-heading">How It Works</h2>
        </div>

        {/* Alternating articles */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(4rem, 8vw, 8rem)',
          }}
        >
          {WORKFLOW_STEPS.map((step, i) => (
            <article
              key={step.annotation}
              ref={(el) => { articlesRef.current[i] = el; }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: step.align === 'right' ? 'flex-end' : 'flex-start',
                textAlign: step.align,
              }}
            >
              {/* Annotation */}
              <span className="lp-eyebrow" style={{ marginBottom: '1rem' }}>
                {step.annotation}
              </span>

              {/* Headline */}
              <h3
                style={{
                  fontFamily: 'var(--lp-font-display)',
                  fontSize: 'clamp(2.5rem, 8vw, 8rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  margin: 0,
                  color: 'var(--lp-fg)',
                }}
              >
                {step.pre}
                <HighlightText parallaxSpeed={0.6}>{step.highlight}</HighlightText>
                {step.post}
              </h3>

              {/* Description */}
              <p
                className="lp-body"
                style={{ maxWidth: '28rem', marginTop: '1.5rem' }}
              >
                {step.desc}
              </p>

              {/* Decorative line */}
              <div
                style={{
                  width: 'clamp(6rem, 12vw, 12rem)',
                  height: '1px',
                  backgroundColor: 'var(--lp-border)',
                  marginTop: '2rem',
                }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
