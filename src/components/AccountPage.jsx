import React from 'react';
import RadarLogo from './RadarLogo.jsx';
import SignupFormDemo from './ui/signup-form-demo.jsx';
import './account.css';

export default function AccountPage({ mode = 'login', onNavigate, onAuthSuccess }) {
  const isSignup = mode === 'signup';
  return (
    <main className="echoleaf-account-page">
      <div className="echoleaf-account-shade" aria-hidden="true" />
      <a className="echoleaf-account-brand" href="/"><RadarLogo className="echoleaf-account-radar-logo" /> ECHO LEAF</a>
      <a className="echoleaf-account-home" href="/" onClick={onNavigate ? onNavigate('/') : undefined}>← Back to Home</a>
      <nav className="echoleaf-account-switch" aria-label="Account access">
        <a className={!isSignup ? 'is-active' : ''} href="/login" onClick={onNavigate('/login')}>Login</a>
        <a className={isSignup ? 'is-active' : ''} href="/signup" onClick={onNavigate('/signup')}>Sign Up</a>
      </nav>
      <SignupFormDemo mode={mode} onAuthSuccess={onAuthSuccess} />
      <span className="echoleaf-account-footer">Hypnexis Hackathon · Manipal University Jaipur</span>
    </main>
  );
}
