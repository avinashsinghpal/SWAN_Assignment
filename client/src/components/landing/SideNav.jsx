/**
 * SideNav - desktop-only fixed left navigation with dot indicators.
 * Active section tracked via IntersectionObserver.
 * @param {{ items: Array<{id: string, label: string}> }} props
 */
import { useState, useEffect, useCallback } from 'react';

export function SideNav({ items }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const observers = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [items]);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <nav className="lp-sidenav" aria-label="Page sections">
      {items.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`lp-sidenav-item${active === id ? ' active' : ''}`}
          onClick={() => scrollTo(id)}
          aria-label={`Navigate to ${label} section`}
          style={{ background: 'transparent', border: 'none', padding: 0 }}
        >
          <span className="lp-sidenav-dot" />
          <span className="lp-sidenav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
