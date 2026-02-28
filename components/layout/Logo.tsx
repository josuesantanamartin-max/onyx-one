import React from 'react';

/**
 * Aliseus Logo — Vientos alisios (trade winds).
 * Uses the brand reference PNG directly for pixel-perfect reproduction.
 */
export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/logo-aliseus.png"
    alt="Aliseus"
    className={className}
    style={{ objectFit: 'contain' }}
  />
);
