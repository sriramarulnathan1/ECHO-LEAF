import React, { useState } from 'react';

export function EvervaultCard({ text = 'Login', href = '#', className = '', onClick }) {
  const [hovering, setHovering] = useState(false);
  return (
    <a
      className={`evervault-login ${className}${hovering ? ' is-hovering' : ''}`}
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <span className="evervault-login__glow" aria-hidden="true" />
      <span className="evervault-login__label">{text}</span>
    </a>
  );
}
