import React from 'react';

/**
 * Onyx Suite Logo — Bold angular "O" monogram.
 * Self-contained white mark designed to live inside a colored container.
 * Reads perfectly at small sizes (20px+).
 */
export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Onyx Suite"
    fill="none"
  >
    {/* Bold octagonal "O" — thick outer ring cut with angular facets */}
    <path
      d="
              M 256 60
              L 390 130
              L 440 256
              L 390 382
              L 256 452
              L 122 382
              L 72  256
              L 122 130
              Z
            "
      stroke="currentColor"
      strokeWidth="62"
      fill="none"
      strokeLinejoin="round"
    />
    {/* Center dot — the "soul" of the gemstone */}
    <circle cx="256" cy="256" r="36" fill="currentColor" />
  </svg>
);
