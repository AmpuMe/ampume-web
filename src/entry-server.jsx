import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import PasswordGate from './components/PasswordGate'

export function render(url, context) {
  const helmetContext = {}

  const html = ReactDOMServer.renderToString(
    <PasswordGate>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url} context={context}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </PasswordGate>
  )

  const { helmet } = helmetContext
  
  return { html, helmet }
}