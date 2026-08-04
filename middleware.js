// Vercel Routing Middleware — gates the entire site behind a password.
//
// The password lives ONLY in the server-side env var SITE_PASSWORD
// (deliberately not VITE_-prefixed, so Vite never inlines it into the
// client bundle). Set SITE_PASSWORD in Vercel Project Settings > Environment
// Variables for whichever environments should be gated. If it's unset,
// this middleware is a no-op and the site renders normally.
//
// On success we set an HttpOnly cookie holding a SHA-256 hash of the
// password (never the raw password), so it can't be read from the
// browser's cookie jar and replayed as the plaintext password elsewhere.

import { next } from '@vercel/functions';

const COOKIE_NAME = 'site_auth';
const LOGIN_PATH = '/__site-auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const config = {
  // Run on every path, including the login-form submission endpoint —
  // the branch below handles that path explicitly.
  matcher: ['/(.*)'],
};

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return out;
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function loginPage({ error = false, redirectTo = '/' } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>AmpuMe</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;font-family:Inter,'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <form method="POST" action="${LOGIN_PATH}" style="width:100%;max-width:360px;text-align:center;padding:0 1.5rem;">
    <input type="hidden" name="redirect" value="${escapeAttr(redirectTo)}" />
    <p style="font-size:1.5rem;font-weight:600;color:#fff;letter-spacing:-0.02em;margin-bottom:2.5rem;">AmpuMe.</p>
    <div style="width:40px;height:2px;background:#C6A87C;margin:0 auto 2.5rem;"></div>
    <p style="font-size:0.75rem;font-weight:500;color:rgba(255,255,255,0.5);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:1.5rem;">Enter password to continue</p>
    <input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password" style="width:100%;padding:0.875rem 1rem;font-size:16px;font-family:inherit;color:#fff;background:rgba(255,255,255,0.06);border:1px solid ${error ? '#e53e3e' : 'rgba(255,255,255,0.12)'};border-radius:9999px;outline:none;box-sizing:border-box;margin-bottom:${error ? '0.75rem' : '1.25rem'};text-align:center;letter-spacing:0.04em;" />
    ${error ? '<p style="font-size:0.7rem;color:#e53e3e;margin-bottom:1.25rem;letter-spacing:0.04em;">Incorrect password.</p>' : ''}
    <button type="submit" style="width:100%;padding:0.875rem;font-size:0.7rem;font-weight:700;font-family:inherit;color:#000;background:#fff;border:none;border-radius:9999px;cursor:pointer;text-transform:uppercase;letter-spacing:0.15em;">Enter</button>
  </form>
</body>
</html>`;
}

function htmlResponse(html, status) {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export default async function middleware(request) {
  const password = process.env.SITE_PASSWORD;

  // No password configured for this environment: don't gate.
  if (!password) return next();

  const url = new URL(request.url);
  const expectedHash = await sha256Hex(password);
  const secureFlag = url.protocol === 'https:' ? '; Secure' : '';

  if (url.pathname === LOGIN_PATH && request.method === 'POST') {
    const form = await request.formData();
    const attempt = String(form.get('password') || '');
    const redirectTo = String(form.get('redirect') || '/');

    if (timingSafeEqual(attempt, password)) {
      const res = new Response(null, {
        status: 303,
        headers: { location: redirectTo },
      });
      res.headers.append(
        'set-cookie',
        `${COOKIE_NAME}=${expectedHash}; Path=/; HttpOnly${secureFlag}; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
      );
      return res;
    }

    return htmlResponse(loginPage({ error: true, redirectTo }), 401);
  }

  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies[COOKIE_NAME];

  if (token && timingSafeEqual(token, expectedHash)) {
    return next();
  }

  const redirectTo = request.method === 'GET' ? url.pathname + url.search : '/';
  return htmlResponse(loginPage({ redirectTo }), 401);
}
