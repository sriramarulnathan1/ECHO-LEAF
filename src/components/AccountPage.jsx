import React from 'react';
import SignupFormDemo from './ui/signup-form-demo.jsx';
import './account.css';

export default function AccountPage({ mode = 'login', onNavigate }) {
  const isSignup = mode === 'signup';
  return (
    <main className="echoleaf-account-page">
      <div className="echoleaf-account-shade" aria-hidden="true" />
      <a className="echoleaf-account-brand" href="/">ECHOLEAF</a>
      <nav className="echoleaf-account-switch" aria-label="Account access">
        <a className={!isSignup ? 'is-active' : ''} href="/login" onClick={onNavigate('/login')}>Login</a>
        <a className={isSignup ? 'is-active' : ''} href="/signup" onClick={onNavigate('/signup')}>Sign Up</a>
      </nav>
      <SignupFormDemo mode={mode} />
      <span className="echoleaf-account-footer">Hypnexis Hackathon · Manipal University Jaipur</span>
    </main>
  );
}
