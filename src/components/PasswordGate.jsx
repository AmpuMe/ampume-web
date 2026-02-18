import { useState } from 'react';

const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD;

const PasswordGate = ({ children }) => {
  const [authorized, setAuthorized] = useState(
    () => !SITE_PASSWORD || (typeof window !== 'undefined' && sessionStorage.getItem('site-auth') === 'true')
  );
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  if (authorized) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === SITE_PASSWORD) {
      sessionStorage.setItem('site-auth', 'true');
      setAuthorized(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      fontFamily: 'Inter, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '360px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          This site is protected
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem' }}>
          Enter the password to continue.
        </p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: `1px solid ${error ? '#e53e3e' : '#ddd'}`,
            borderRadius: '8px',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: '1rem',
          }}
        />
        {error && (
          <p style={{ fontSize: '0.8rem', color: '#e53e3e', marginBottom: '1rem' }}>
            Incorrect password.
          </p>
        )}
        <button type="submit" style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#fff',
          background: '#2563eb',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}>
          Enter
        </button>
      </form>
    </div>
  );
};

export default PasswordGate;
