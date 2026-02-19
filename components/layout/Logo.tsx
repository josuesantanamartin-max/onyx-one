import React from 'react';

/**
 * Onyx Suite Logo — Hexagonal gemstone / onyx crystal mark.
 * Uses currentColor for the glow/highlight tints so it adapts to dark & light contexts.
 * The main facets use indigo-rooted fills with opacity so they read well on any background.
 */
export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Onyx Suite"
  >
    {/* ── Top crown facet (brightest) ── */}
    <polygon
      points="256,82  352,182  256,210  160,182"
      fill="currentColor"
      fillOpacity="1"
    />

    {/* ── Left facet (mid-tone) ── */}
    <polygon
      points="160,182  256,210  194,318  108,248"
      fill="currentColor"
      fillOpacity="0.60"
    />

    {/* ── Right facet (slightly lighter than left) ── */}
    <polygon
      points="352,182  404,248  318,318  256,210"
      fill="currentColor"
      fillOpacity="0.75"
    />

    {/* ── Bottom pavilion (darkest) ── */}
    <polygon
      points="194,318  256,210  318,318  256,430"
      fill="currentColor"
      fillOpacity="0.40"
    />

    {/* ── Top highlight reflection (white spark at tip) ── */}
    <polygon
      points="256,82  288,154  256,148  224,154"
      fill="white"
      fillOpacity="0.55"
    />

    {/* ── Girdle edge line for crispness ── */}
    <line x1="160" y1="182" x2="352" y2="182" stroke="white" strokeWidth="2" strokeOpacity="0.30" />
  </svg>
);
