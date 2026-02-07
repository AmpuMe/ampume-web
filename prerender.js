import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// Wait for build to complete before running this script
// paths depend on where vite build outputs
const templatePath = toAbsolute('dist/index.html')

// Determine routes to pre-render
const routesToPrerender = [
    '/',
    '/ai-support',
    '/shop',
    '/resources',
    '/privacy-policy',
    '/terms-of-service',
    '/accessibility-statement'
]

;(async () => {
  if (!fs.existsSync(templatePath)) {
      console.error('Template not found:', templatePath)
      process.exit(1)
  }
    
  const template = fs.readFileSync(templatePath, 'utf-8')

  // Save bare app shell as SPA fallback (no prerendered content)
  fs.writeFileSync(toAbsolute('dist/200.html'), template)
  console.log('saved SPA fallback: dist/200.html')

  // Import from built server entry
  // This requires npm run build:server to have run
  const { render } = await import('./dist/server/entry-server.js')

  // pre-render each route...
  for (const url of routesToPrerender) {
    const context = {}
    const { html, helmet } = render(url, context)

    const helmetHead = `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
    `

    const appHtml = html

    const htmlContent = template
      .replace(`<!--app-head-->`, helmetHead)
      .replace(`<!--app-html-->`, appHtml)

    const filePath = `dist${url === '/' ? '/index.html' : `${url}/index.html`}`
    
    // Ensure directory exists
    const dir = path.dirname(toAbsolute(filePath))
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(toAbsolute(filePath), htmlContent)
    console.log('pre-rendered:', filePath)
  }

  // Cleanup server build to avoid deploying backend code to frontend CDN
  fs.rmSync(toAbsolute('dist/server'), { recursive: true, force: true })
})()