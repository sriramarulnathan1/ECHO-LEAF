import React, { useMemo, useState } from 'react';
import './evervault-card-demo.css';

const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function makePattern() {
  return Array.from({ length: 520 }, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join('');
}

function Icon({ className = '' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>;
}

export default function EvervaultCardDemo() {
  const [point, setPoint] = useState({ x: 50, y: 50 });
  const pattern = useMemo(makePattern, []);

  function trackPointer(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPoint({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
  }

  return (
    <section className="echo-evervault-demo">
      <Icon className="echo-evervault-corner echo-evervault-corner--tl" />
      <Icon className="echo-evervault-corner echo-evervault-corner--tr" />
      <Icon className="echo-evervault-corner echo-evervault-corner--bl" />
      <Icon className="echo-evervault-corner echo-evervault-corner--br" />
      <div className="echo-evervault-surface" onPointerMove={trackPointer} style={{ '--pointer-x': `${point.x}%`, '--pointer-y': `${point.y}%` }}>
        <div className="echo-evervault-code" aria-hidden="true">{pattern}</div>
        <div className="echo-evervault-orb"><span>ECHO LEAF</span></div>
      </div>
      <h1>Hear the Echo of Every Leaf</h1>
      <p>EchoLeaf uses satellite radar and optical data to detect forest loss as it happens.</p>
      <span className="echo-evervault-badge">Hypnexis · Manipal University Jaipur</span>
    </section>
  );
}
