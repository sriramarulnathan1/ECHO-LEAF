import React, { useEffect, useRef, useState } from 'react';
import AscendPage from './components/AscendPage.jsx';
import Hero38 from './components/originkit/hero-38.tsx';
import AccountPage from './components/AccountPage.jsx';

const currentPath = () => window.location.pathname.replace(/\/$/, '') || '/';
const isAccountPath = (path) => path === '/login' || path === '/signup';

export default function App() {
  const [path, setPath] = useState(currentPath);
  const [showAscend, setShowAscend] = useState(path !== '/hero-38' && !isAccountPath(path));
  const [showHero, setShowHero] = useState(path === '/hero-38');
  const [accountPath, setAccountPath] = useState(isAccountPath(path) ? path : '');
  const [transition, setTransition] = useState('');
  const heroVisibleRef = useRef(showHero);
  heroVisibleRef.current = showHero;

  useEffect(() => {
    const onPopState = () => {
      const nextPath = currentPath();
      setPath(nextPath);
      if (nextPath === '/hero-38') {
        setShowAscend(false);
        setShowHero(true);
        setAccountPath('');
        setTransition('');
      } else if (isAccountPath(nextPath)) {
        setShowAscend(false);
        setShowHero(false);
        setAccountPath(nextPath);
        setTransition('');
      } else {
        setShowAscend(true);
        setAccountPath('');
        if (heroVisibleRef.current) setTransition('leaving');
        else {
          setShowHero(false);
          setTransition('');
        }
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const openHero = () => {
    if (path === '/hero-38') return;
    window.history.pushState({}, '', '/hero-38');
    setPath('/hero-38');
    setShowAscend(true);
    setShowHero(true);
    setTransition('entering');
  };

  const openAccount = (nextPath) => (event) => {
    event.preventDefault();
    if (path === nextPath) return;
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
    setShowAscend(false);
    setShowHero(false);
    setAccountPath(nextPath);
    setTransition('');
  };

  const finishTransition = (event) => {
    if (event.target !== event.currentTarget) return;
    if (transition === 'entering') setShowAscend(false);
    if (transition === 'leaving') setShowHero(false);
    setTransition('');
  };

  return (
    <main className="page">
      {showAscend && <AscendPage onOpenOrigin={openHero} />}
      {showHero && (
        <div
          className={`hero-route${transition ? ` hero-route--${transition}` : ''}`}
          onAnimationEnd={finishTransition}
        >
          <Hero38 />
        </div>
      )}
      {accountPath && <AccountPage mode={accountPath === '/signup' ? 'signup' : 'login'} onNavigate={openAccount} />}
    </main>
  );
}
