import React, { useState } from "react";
import ParticleSimulation from "./particle-simulation";
import RadarLogo from "../../../RadarLogo.jsx";

const forbitDashboardUrl = "/forbit/";

export function SectionHero() {
  const [showPanel, setShowPanel] = useState(false);

  const downloadChecklist = () => {
    const text = `ECHO LEAF FOREST MONITORING CHECKLIST\n\n1. Compare the forest canopy across both observation dates.\n2. Review radar and optical signals before confirming change.\n3. Check detected clearing against the satellite observations.\n4. Read the full forest signal around each change.\n5. Confirm the alert before taking action.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "origin-review-checklist.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="hero-38">
      <main className="hero" id="top">
        <header className="nav">
          <a className="brand" href="#top" aria-label="Echo Leaf home"><RadarLogo className="hero-radar-logo" /> ECHO LEAF</a>
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#how">HOW IT WORKS</a>
            <a href="#benchmarks">METRICS</a>
            <a href="#docs">DATA</a>
          </nav>
          <button className="download-btn" onClick={downloadChecklist}>Download</button>
        </header>
        <div className="ghost-word" aria-hidden="true">Echo Leaf</div>
        <section className="visual" role="img" aria-label="Satellite view of a forest canopy under observation">
          <ParticleSimulation
            portraitImage="/originkit/hero-38/tree.png"
            background="transparent"
            density={50}
            dotSize={30}
            hover={{ reach: 30, lift: 51, damping: 58 }}
            style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0 }}
          />
        </section>
        <section className="bottom-layout">
          <div className="headline-block">
            <a className="dark-cta" href={forbitDashboardUrl}><span>Launch Dashboard</span><span className="arrow">↗</span></a>
            <h1>Hear the Echo of<br />Every Leaf</h1>
          </div>
          <p className="intro">EchoLeaf uses satellite radar and optical data, powered by machine learning, to detect illegal forest clearing the moment it happens.</p>
          <div className="stat-grid" id="benchmarks">
            <article className="stat-card"><strong>96.4%</strong><div className="stat-bottom"><p>ML detection confidence across observed canopy changes.</p><button aria-label="View ML detection confidence" className="round-link">↗</button></div></article>
            <article className="stat-card"><strong>128 ha</strong><div className="stat-bottom"><p>Forest area flagged for potential destruction.</p><button aria-label="View detected forest area" className="round-link">↗</button></div></article>
          </div>
        </section>
        <a className="scroll-cue" href="#next-page-title" aria-label="Scroll to the next page"><span>Explore forest monitoring</span><span aria-hidden="true">↓</span></a>
        <div className="demo-panel" id="how" hidden={!showPanel}>
          <button className="panel-close" onClick={() => setShowPanel(false)} aria-label="Close">×</button>
          <span className="eyebrow">FOREST MONITORING</span>
          <h2>Radar → change → alert.</h2>
          <p>EchoLeaf compares Sentinel-1 radar and Sentinel-2 optical observations to detect forest clearing, measure its area, and flag changes for review.</p>
        </div>
        <div id="docs" className="sr-anchor" aria-hidden="true" />
      </main>
      <section className="next-page" id="next-page" aria-labelledby="next-page-title">
        <div className="next-page__inner">
          <span className="next-page__eyebrow">Hypnexis Hackathon • Manipal University Jaipur</span>
          <h2 id="next-page-title">Hear the Echo of<br />Every Leaf</h2>
          <p className="next-page__intro">EchoLeaf connects satellite radar and optical signals to reveal where forest cover is changing.</p>
          <div className="next-page__cards">
            <article className="next-page__card"><span>01</span><h3>Track canopy loss</h3><p>Compare forest cover before and after a detected change.</p></article>
            <article className="next-page__card"><span>02</span><h3>Confirm with radar</h3><p>Use Sentinel-1 observations to monitor change through cloud cover.</p></article>
            <article className="next-page__card"><span>03</span><h3>Review the alert</h3><p>See the affected area and satellite evidence behind each signal.</p></article>
          </div>
          <a className="next-page__back" href="#top">Back to the top <span aria-hidden="true">↑</span></a>
        </div>
      </section>
      <section className="review-page" aria-labelledby="review-page-title">
        <div className="review-page__inner">
          <div className="review-page__copy">
            <span className="next-page__eyebrow">From first signal to forest alert</span>
            <h2 id="review-page-title">See every canopy change.</h2>
            <p>Compare satellite observations, review the detected area, and understand the signal behind each alert.</p>
            <a className="review-page__link" href="#how">Explore satellite signals <span aria-hidden="true">↗</span></a>
          </div>
          <div className="review-board" aria-label="Forest change detection status">
            <div className="review-board__top"><span>Forest alert #284</span><span className="review-board__status"><i /> Ready to review</span></div>
            <h3>Open-cast mining detected</h3>
            <p>EchoLeaf analyzed <strong>2 sensors</strong> across <strong>48 months</strong>.</p>
            <div className="review-board__row"><span>Detection confidence</span><strong>High</strong><b><i style={{ width: "24%" }} /></b></div>
            <div className="review-board__row"><span>Canopy loss</span><strong>96.4%</strong><b><i style={{ width: "94%" }} /></b></div>
            <div className="review-board__note"><span>Satellite evidence</span><p>Sentinel-1 radar confirms a change in the forest canopy.</p></div>
          </div>
        </div>
        <div className="review-metrics"><div><strong>128 ha</strong><span>area destroyed</span></div><div><strong>96.4%</strong><span>ML confidence</span></div><div><strong>0.91</strong><span>radar confirmation</span></div></div>
      </section>
      <section className="closing-page" aria-labelledby="closing-page-title">
        <div className="closing-page__card">
          <span className="next-page__eyebrow">Hypnexis Hackathon • Manipal University Jaipur</span>
          <h2 id="closing-page-title">Hear the Echo of Every Leaf</h2>
          <p>EchoLeaf detects illegal forest clearing with Sentinel-1 radar, Sentinel-2 optical data, and machine learning.</p>
          <a href={forbitDashboardUrl} className="closing-page__button">Launch Dashboard <span aria-hidden="true">↑</span></a>
        </div>
        <footer className="closing-page__footer"><a className="brand" href="#top"><RadarLogo className="hero-radar-logo" /> ECHO LEAF</a><span>EchoLeaf © 2026 | Built for Hypnexis at Manipal University Jaipur | Powered by Sentinel-1 &amp; Sentinel-2 satellite data</span></footer>
      </section>
    </div>
  );
}
