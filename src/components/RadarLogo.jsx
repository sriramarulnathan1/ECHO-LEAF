import React from 'react';

export default function RadarLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="1.6" />
      <path d="M12 12 18.2 5.8" />
      <path d="M16.25 7.75a6 6 0 0 1 0 8.5M7.75 16.25a6 6 0 0 1 0-8.5" />
      <path d="M19.05 4.95a10 10 0 0 1 0 14.1M4.95 19.05a10 10 0 0 1 0-14.1" />
    </svg>
  );
}
