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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      fontFamily: 'Inter, Helvetica Neue, Helvetica, Arial, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: '360px',
        textAlign: 'center',
        padding: '0 1.5rem',
      }}>
        <p style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '-0.02em',
          marginBottom: '2.5rem',
        }}>
          AmpuMe.
        </p>
        <div style={{
          width: '40px',
          height: '2px',
          background: '#C6A87C',
          margin: '0 auto 2.5rem',
        }} />
        <p style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>
          Enter password to continue
        </p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            color: '#fff',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${error ? '#e53e3e' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '9999px',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: error ? '0.75rem' : '1.25rem',
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        />
        {error && (
          <p style={{
            fontSize: '0.7rem',
            color: '#e53e3e',
            marginBottom: '1.25rem',
            letterSpacing: '0.04em',
          }}>
            Incorrect password.
          </p>
        )}
        <button type="submit" style={{
          width: '100%',
          padding: '0.875rem',
          fontSize: '0.7rem',
          fontWeight: 700,
          fontFamily: 'inherit',
          color: '#000',
          background: '#fff',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}>
          Enter
        </button>
      </form>
    </div>
  );
};

export default PasswordGate;
