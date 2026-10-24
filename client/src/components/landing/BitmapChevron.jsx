/**
 * BitmapChevron - 18px pixel-style arrow SVG.
 * Rotates 45 degrees on parent hover via CSS (.lp-chevron-wrap).
 */
export function BitmapChevron({ size = 18 }) {
  return (
    <span className="lp-chevron-wrap" aria-hidden="true">
      <svg
        width={size}
        height={size}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pixel-style arrow pointing right */}
        <rect x="2"  y="8"  width="2" height="2" fill="currentColor" />
        <rect x="4"  y="8"  width="2" height="2" fill="currentColor" />
        <rect x="6"  y="8"  width="2" height="2" fill="currentColor" />
        <rect x="8"  y="8"  width="2" height="2" fill="currentColor" />
        <rect x="10" y="8"  width="2" height="2" fill="currentColor" />
        <rect x="12" y="8"  width="2" height="2" fill="currentColor" />
        <rect x="10" y="6"  width="2" height="2" fill="currentColor" />
        <rect x="10" y="10" width="2" height="2" fill="currentColor" />
        <rect x="12" y="4"  width="2" height="2" fill="currentColor" />
        <rect x="12" y="12" width="2" height="2" fill="currentColor" />
      </svg>
    </span>
  );
}
