import React, { useEffect, useState } from 'react';
import TerraDusk from './TerraDusk.tsx';
import SpectralParticles from './originkit/ui/hero-38/particle-simulation.tsx';
import { EvervaultCard } from './ui/evervault-card.jsx';
import './ascend.css';

const xStops = [{ p: 0, v: 0 }, { p: .32, v: -3.1 }, { p: .64, v: 3.2 }, { p: 1, v: 0 }];
const yStops = [{ p: 0, v: -4.5 }, { p: .32, v: .55 }, { p: .64, v: .45 }, { p: 1, v: .15 }];
const sStops = [{ p: 0, v: 2.15 }, { p: .32, v: 1 }, { p: .64, v: .92 }, { p: 1, v: 1.12 }];

function sample(stops, p) {
  const i = stops.findIndex((stop) => stop.p >= p);
  if (i <= 0) return stops[Math.max(0, i)].v;
  const a = stops[i - 1], b = stops[i];
  const t = (p - a.p) / (b.p - a.p);
  const eased = t * t * (3 - 2 * t);
  return a.v + (b.v - a.v) * eased;
}

function Icon({ name }) {
  const paths = {
    workflow: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v3a3 3 0 0 0 3 3h3"/></>,
    analytics: <><path d="M4 19V5M4 19h16M8 16v-4M13 16V8M18 16V9"/></>,
    leads: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>,
    globe: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/></>,
    arrow: <><path strokeWidth="2" d="M5 12h14"/><path strokeWidth="2" d="m12 5 7 7-7 7"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const features = [
  ['workflow', 'Hasdeo Arand Forest (Chhattisgarh)', ''],
  ['analytics', 'Korba North Forest Division (Chhattisgarh)', ''],
  ['leads', 'Saranda Forest Reserve (Jharkhand)', ''],
  ['bolt', 'Keonjhar Joda–Barbil Mining Corridor (Odisha)', ''],
  ['shield', 'Similipal Tiger Reserve & Buffer (Odisha)', ''],
  ['globe', 'Hindol Forest Range (Odisha)', ''],
  ['analytics', 'Wayanad Western Ghats Complex (Kerala)', ''],
  ['workflow', 'Dampa Landscape (Mizoram)', ''],
];
const bars = [62, 88, 47, 95, 71, 80, 58];
const funnel = [['Tree Canopy', 90], ['Forest Loss', 72], ['Radar Signal', 48], ['Optical Signal', 34]];
const stats = [['128 ha', 'Area Destroyed'], ['96.4%', 'ML Detection Confidence'], ['Mar 15 – Apr 15', 'Date Interval'], ['0.91', 'Sentinel-1 Radar Confirmation']];

export default function AscendPage({ onOpenOrigin }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const scroller = document.querySelector('.ascend-route');
    if (!scroller) return;
    const onScroll = () => setProgress(Math.max(0, Math.min(1, scroller.scrollTop / Math.max(1, scroller.scrollHeight - scroller.clientHeight))));
    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const nodes = document.querySelectorAll('.ascend-route [data-reveal]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { nodes.forEach((node) => node.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    }), { threshold: .18, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const narrowScreen = width <= 720;
  const centerX = width * (.5 + sample(xStops, progress) / 20);
  const centerY = height * (.6 - sample(yStops, progress) * .1);
  const globeSize = 520 * sample(sStops, progress);

  return (
    <div className="ascend-shell">
      <TerraDusk map="/images/earth-blue-marble.jpg" size={globeSize} centerX={centerX} centerY={centerY} stars={7} drag={false} hover={0} sun="fixed" daylight={66} look={{ clouds: 2.8, lights: 3.5, atmosphere: '#9fc4ff' }} style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'transparent', pointerEvents: 'none' }} />
      <aside className={`ascend-branch-rail${narrowScreen ? ' ascend-branch-rail--wide' : ''}`} aria-label="Interactive tree branch">
        <SpectralParticles
          portraitImage="/originkit/hero-38/tree.png"
          background="transparent"
          density={7}
          dotSize={24}
          hover={{ reach: 28, lift: 48, damping: 58 }}
          rotation={narrowScreen ? 0 : 90}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: narrowScreen ? '100%' : 'min(145vh, 1500px)',
            height: narrowScreen ? '100%' : 'clamp(300px, 25vw, 480px)',
            minWidth: 0,
            minHeight: 0,
            transform: narrowScreen ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) rotate(90deg)',
          }}
        />
      </aside>
      <aside className={`ascend-branch-rail ascend-branch-rail--right${narrowScreen ? ' ascend-branch-rail--wide' : ''}`} aria-label="Mirrored interactive tree branch">
        <SpectralParticles
          portraitImage="/originkit/hero-38/tree.png"
          background="transparent"
          density={7}
          dotSize={24}
          hover={{ reach: 28, lift: 48, damping: 58 }}
          rotation={narrowScreen ? 0 : 90}
          mirrorX
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: narrowScreen ? '100%' : 'min(145vh, 1500px)',
            height: narrowScreen ? '100%' : 'clamp(300px, 25vw, 480px)',
            minWidth: 0,
            minHeight: 0,
            transform: narrowScreen ? 'translate(-50%, -50%) scaleX(-1)' : 'translate(-50%, -50%) rotate(90deg) scaleX(-1)',
          }}
        />
      </aside>
      <div className="ascend-route">
      <div className="ascend-content" id="top">
        <header className="ascend-hero">
          <nav className="ascend-nav">
            <a className="ascend-brand" href="#top"><span>▲</span> ECHOLEAF</a>
            <div className="ascend-nav-links"><a href="#features">Regions</a><a href="#solutions">Detection</a><a href="#cta">Alerts</a><a href="#footer">About</a></div>
            <div className="ascend-account-actions"><EvervaultCard text="Login" href="/login" className="ascend-btn ascend-btn-logged-out" /><a className="ascend-btn ascend-btn-logged-out" href="/signup">Sign Up</a></div>
          </nav>
          <div className="ascend-hero-inner">
            <h1 className="ascend-title" data-reveal style={{ '--rd': '60ms' }}>Hear the Echo<br/>of Every Leaf</h1>
            <p className="ascend-sub" data-reveal style={{ '--rd': '180ms' }}>EchoLeaf uses satellite radar and optical data, powered by machine learning, to detect illegal forest clearing the moment it happens.</p>
            <div className="ascend-actions" data-reveal style={{ '--rd': '300ms' }}><a className="ascend-btn ascend-btn-primary" href="#features">Launch Dashboard <Icon name="arrow"/></a><a className="ascend-btn ascend-btn-outline" href="#solutions">Timeline Comparison</a></div>
          </div>
          <div className="ascend-logos" data-reveal style={{ '--rd': '420ms' }}><span>Hypnexis Hackathon - Manipal University Jaipur</span><div>{['Keonjhar, Odisha', 'Hasdeo Arand', 'Similipal', 'Saranda Forest', 'Sentinel-1 SAR', 'Sentinel-2 Optical'].map((logo) => <b key={logo}>{logo}</b>)}</div></div>
        </header>

        <section className="ascend-section ascend-features" id="features">
          <div className="ascend-section-head"><span className="ascend-eyebrow">Sentinel-1 Radar &amp; Sentinel-2 Optical</span><h2 data-reveal style={{ '--rd': '80ms' }}>Select Forest Region</h2><p data-reveal style={{ '--rd': '160ms' }}>Regional datasets grouped by training, frozen test, and stress-test splits.</p></div>
          <div className="ascend-feature-grid">{features.map(([icon, title, copy], i) => <article className="ascend-card" data-reveal style={{ '--rd': `${i * 90}ms` }} key={title}><div className="ascend-card-icon"><Icon name={icon}/></div><h3>{title}</h3>{copy && <p>{copy}</p>}</article>)}</div>
        </section>

        <section className="ascend-section ascend-showcase" id="solutions">
          <div className="ascend-showcase-grid">
            <div className="ascend-showcase-copy"><span className="ascend-eyebrow">Hypnexis Hackathon - Manipal University Jaipur</span><h2 data-reveal style={{ '--rd': '90ms' }}>Destruction Site Close-Up</h2><p data-reveal style={{ '--rd': '180ms' }}>EchoLeaf uses satellite radar and optical data, powered by machine learning, to detect illegal forest clearing the moment it happens.</p><a className="ascend-btn ascend-btn-primary" data-reveal style={{ '--rd': '270ms' }} href="#solutions">Zoom to Defect <Icon name="arrow"/></a></div>
            <div className="ascend-dashboard" data-reveal style={{ '--rd': '160ms' }}><div className="ascend-dash-top"><strong>Phenological ECG Monitor</strong><span><i/> 48-month vegetation health signal</span></div><div className="ascend-dash-bars">{bars.map((bar, i) => <i key={i} style={{ height: `${bar}%`, animationDelay: `${i * 90}ms` }}/>)}</div><div className="ascend-funnel">{funnel.map(([label, value]) => <div className="ascend-funnel-row" key={label}><span>{label}</span><b>{value}%</b><div><i style={{ '--w': `${value}%` }}/></div></div>)}</div></div>
          </div>
          <div className="ascend-stats">{stats.map(([value, label], i) => <div className="ascend-stat" data-reveal style={{ '--rd': `${i * 80}ms` }} key={value}><strong>{value}</strong><span>{label}</span></div>)}</div>
        </section>

        <section className="ascend-section ascend-cta" id="cta">
          <div className="ascend-cta-card"><span className="ascend-eyebrow" data-reveal style={{ '--rd': '60ms' }}>Hypnexis Hackathon - Manipal University Jaipur</span><h2 data-reveal style={{ '--rd': '140ms' }}>Hear the Echo of Every Leaf</h2><p data-reveal style={{ '--rd': '220ms' }}>EchoLeaf uses satellite radar and optical data, powered by machine learning, to detect illegal forest clearing the moment it happens.</p><div className="ascend-actions" data-reveal style={{ '--rd': '300ms' }}><a className="ascend-btn ascend-btn-primary" href="#features">Launch Dashboard <Icon name="arrow"/></a><a className="ascend-btn ascend-btn-outline" href="#solutions">Zoom to Defect</a></div></div>
          <footer className="ascend-footer" id="footer"><div><a className="ascend-brand" href="#top"><span>▲</span> ECHOLEAF</a><p>Satellite-based forest destruction monitoring.</p></div><div className="ascend-footer-cols"><div><b>Product</b><a href="#features">Forest Regions</a><a href="#solutions">Detection</a><a href="#cta">Monitoring</a></div><div><b>Company</b><a href="#footer">About</a><a href="#footer">Hypnexis</a><a href="#footer">Manipal University Jaipur</a></div><div><b>Data</b><a href="#footer">Sentinel-1 Radar</a><a href="#footer">Sentinel-2 Optical</a><a href="#footer">ML Surveillance</a></div></div></footer>
          <p className="ascend-copyright">EchoLeaf © 2026 | Built for Hypnexis at Manipal University Jaipur | Powered by Sentinel-1 &amp; Sentinel-2 satellite data</p>
          <button className="ascend-origin-link" onClick={onOpenOrigin}>Launch Dashboard <Icon name="arrow"/></button>
        </section>
      </div>
      </div>
    </div>
  );
}
