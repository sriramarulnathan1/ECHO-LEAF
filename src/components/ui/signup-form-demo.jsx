import React from 'react';
import { supabase } from '../../lib/supabase.js';
import './signup-form-demo.css';

function LabelInput({ label, id, placeholder, type = 'text', autoComplete }) {
  return (
    <label className="echo-form-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} name={id} placeholder={placeholder} type={type} autoComplete={autoComplete} required />
    </label>
  );
}

export default function SignupFormDemo({ mode = 'signup', onAuthSuccess }) {
  const isSignup = mode === 'signup';
  const [authMessage, setAuthMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [pointer, setPointer] = React.useState({ x: 50, y: 50 });

  function trackCardPointer(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthMessage('');
    setIsSubmitting(true);
    const values = new FormData(event.currentTarget);
    const email = String(values.get(isSignup ? 'email' : 'username') || '').trim();
    const password = String(values.get('password') || '');
    try {
      if (isSignup) {
        if (password !== values.get('confirm-password')) {
          setAuthMessage('Passwords do not match.');
          return;
        }
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { first_name: values.get('firstname'), last_name: values.get('lastname') }, emailRedirectTo: window.location.origin } });
        if (error) throw error;
        if (data.session) onAuthSuccess?.();
        else setAuthMessage('Check your email for a confirmation link to finish creating your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthSuccess?.();
      }
    } catch (error) {
      setAuthMessage(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOAuth(provider) {
    setAuthMessage('');
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
    if (error) setAuthMessage(error.message || 'Could not start provider sign-in.');
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
        <button className="echo-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : isSignup ? "Sign up" : "Login"}</button>
      </form>
      <div className="echo-divider"><span>or continue with</span></div>
      <div className="echo-social-list">
        {['Google', 'GitHub'].map((provider) => <button className="echo-social-button" type="button" key={provider} onClick={() => handleOAuth(provider.toLowerCase())}><span className="echo-social-mark" aria-hidden="true">{provider === 'Google' ? 'G' : 'GH'}</span><span>Continue with {provider}</span></button>)}
      </div>
      {authMessage && <p className="echo-auth-message" role="status">{authMessage}</p>}
    </section>
  );
}

