import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase.js';
import './EchoLeafAi.css';

const STARTER_PROMPTS = [
  "How does Sentinel-1 radar detect canopy loss through clouds?",
  "What is ΔNDVI vs ΔVH backscatter?",
  "Summarize the Keonjhar Mining Corridor status.",
  "What should a ranger do upon an unconfirmed alert?",
];

// Clean AI orb icon — single distinctive mark
function AiOrb({ size = 22, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14.5" stroke="url(#orb-ring)" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="5" fill="url(#orb-core)" />
      <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="url(#orb-orbit1)" strokeWidth="0.9" />
      <ellipse cx="16" cy="16" rx="5.5" ry="14" stroke="url(#orb-orbit2)" strokeWidth="0.9" />
      <defs>
        <linearGradient id="orb-ring" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </radialGradient>
        <linearGradient id="orb-orbit1" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#4ade80" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="orb-orbit2" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function EchoLeafAi({ authUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 80);
      inputRef.current?.focus();
    }
  }, [isOpen, messages, scrollToBottom]);

  const handleSend = async (textToSend) => {
    const promptText = (textToSend !== undefined ? textToSend : input).trim();
    if (!promptText || isLoading) return;

    setErrorMessage('');
    const newMessages = [...messages, { role: 'user', content: promptText }];
    setMessages(newMessages);
    if (textToSend === undefined) setInput('');
    setIsLoading(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('You must be signed in to use EchoLeaf AI.');
      }

      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { messages: newMessages.map(m => ({ role: m.role, content: m.content })) },
      });

      if (error) throw new Error(error.message || 'Edge function unreachable.');
      if (data?.error) throw new Error(data.error);

      const reply = data?.reply || 'I received your query but got an empty response.';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.warn('[EchoLeaf AI]', err);
      const msg = err.message || 'Unexpected error.';
      if (
        msg.includes('Failed to send a request to the Edge Function') ||
        msg.includes('404') ||
        msg.includes('FunctionsFetchError')
      ) {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content:
              'EchoLeaf AI is connected.\n\nDeploy the edge function with:\n\n  supabase functions deploy ai-assistant\n\nOnce live, OpenAI responses will appear here.',
          },
        ]);
      } else {
        setErrorMessage(msg);
        if (textToSend === undefined) setInput(promptText);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setErrorMessage('');
    setInput('');
  };

  return (
    <>
      {/* Floating trigger */}
      {!isOpen && (
        <button
          className="elai-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open EchoLeaf AI"
        >
          <span className="elai-fab-halo" aria-hidden="true" />
          <AiOrb size={20} className="elai-fab-orb" />
          <span className="elai-fab-label">EchoLeaf AI</span>
          <span className="elai-fab-dot" aria-hidden="true" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="elai-overlay" role="dialog" aria-label="EchoLeaf AI Assistant">
          <div className="elai-panel">

            {/* Header */}
            <div className="elai-header">
              <div className="elai-header-brand">
                <div className="elai-header-icon">
                  <AiOrb size={22} />
                </div>
                <div>
                  <p className="elai-header-title">EchoLeaf AI</p>
                  <p className="elai-header-sub">Sentinel Surveillance Copilot</p>
                </div>
              </div>
              <div className="elai-header-actions">
                <button
                  type="button"
                  className="elai-icon-btn"
                  onClick={resetChat}
                  title="New conversation"
                  aria-label="Reset"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M8 16H3v5"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="elai-icon-btn"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="elai-divider" />

            {/* Messages */}
            <div className="elai-messages" role="log" aria-live="polite">
              {messages.length === 0 && (
                <div className="elai-welcome">
                  <div className="elai-welcome-icon">
                    <AiOrb size={40} />
                  </div>
                  <h2 className="elai-welcome-title">EchoLeaf AI</h2>
                  <p className="elai-welcome-desc">
                    Sentinel-1 radar &amp; Sentinel-2 optical surveillance assistant. Ask about deforestation alerts, spectral analysis, or ranger protocols.
                  </p>
                  <div className="elai-starters">
                    {STARTER_PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        className="elai-starter"
                        onClick={() => handleSend(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`elai-row elai-row--${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="elai-avatar"><AiOrb size={14} /></div>
                  )}
                  <div className="elai-bubble">{msg.content}</div>
                </div>
              ))}

              {isLoading && (
                <div className="elai-row elai-row--assistant">
                  <div className="elai-avatar"><AiOrb size={14} /></div>
                  <div className="elai-bubble elai-typing">
                    <span className="elai-dot" />
                    <span className="elai-dot" />
                    <span className="elai-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="elai-error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{errorMessage}</span>
                <button type="button" className="elai-error-dismiss" onClick={() => setErrorMessage('')} aria-label="Dismiss">✕</button>
              </div>
            )}

            {/* Input */}
            <div className="elai-input-wrap">
              <form
                className="elai-input-form"
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  className="elai-textarea"
                  placeholder="Ask about canopy alerts, radar signals…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  aria-label="Your message"
                />
                <button
                  type="submit"
                  className="elai-send"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
              <p className="elai-hint">Enter to send · Shift+Enter for newline</p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
