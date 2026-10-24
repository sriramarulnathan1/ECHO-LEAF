import React from 'react';
import './signup-form-demo.css';

function LabelInput({ label, id, placeholder, type = 'text', autoComplete }) {
  return (
    <label className="echo-form-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} name={id} placeholder={placeholder} type={type} autoComplete={autoComplete} required />
    </label>
  );
}

export default function SignupFormDemo({ mode = 'signup' }) {
  const isSignup = mode === 'signup';
  const [authMessage, setAuthMessage] = React.useState('');
  const [pointer, setPointer] = React.useState({ x: 50, y: 50 });

  function trackCardPointer(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setAuthMessage('Authentication is not connected. This page is currently a visual demo.');
  }

  return (
    <section className="echo-signup-card" onPointerMove={trackCardPointer} style={{ '--pointer-x': `${pointer.x}%`, '--pointer-y': `${pointer.y}%` }}>
      <div className="echo-radar-mini" role="img" aria-label="Animated forest monitoring radar" />
      <h1>{isSignup ? 'Create your EchoLeaf account' : 'Welcome back to EchoLeaf'}</h1>
      <p>{isSignup ? 'Join the forest monitoring workspace.' : 'Sign in to continue to your forest dashboard.'}</p>
      <form onSubmit={handleSubmit}>
        {isSignup ? <div className="echo-name-row">
          <LabelInput label="First name" id="firstname" placeholder="First name" autoComplete="given-name" />
          <LabelInput label="Last name" id="lastname" placeholder="Last name" autoComplete="family-name" />
        </div> : null}
        <LabelInput label="Email address" id={isSignup ? 'email' : 'username'} placeholder={isSignup ? 'you@example.com' : 'Enter your email address'} type="email" autoComplete="email" />
        <LabelInput label="Password" id="password" placeholder="Enter your password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} />
        {isSignup ? <LabelInput label="Confirm password" id="confirm-password" placeholder="Re-enter your password" type="password" autoComplete="new-password" /> : null}
        <button className="echo-submit" type="submit">{isSignup ? 'Sign up' : 'Login'} <span aria-hidden="true">→</span></button>
      </form>
      {authMessage && <p className="echo-auth-message" role="status">{authMessage}</p>}
    </section>
  );
}
