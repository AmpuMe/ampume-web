import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// Wait for build to complete before running this script
// paths depend on where vite build outputs
const templatePath = toAbsolute('dist/index.html')

// Static routes — pages whose content is hardcoded in JSX and renders fully
// at SSR time. Adding a new top-level page? Add it here.
const STATIC_ROUTES = [
    '/',
    '/ask-ampume',
    '/shop',
    '/shop/liners',
    '/shop/socks',
    '/shop/sleeves',
    '/shop/accessories',
    '/resources',
    '/telemedicine',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/accessibility-statement',
]

// Build dynamic routes (products + Knowledge Base articles) by querying the
// upstream APIs at build time. Each dynamic route gets a prerendered HTML
// shell with the right title + meta tags so search engines can index it
// properly. The body content still hydrates on the client (data fetching
// lives in useEffect), but crawlers see the canonical metadata immediately.
//
// Each entry shape: { path, title, description } — title/description are
// optional overrides used to patch the prerendered HTML when the React
// component itself can't set them (because data fetching is client-only).
async function getDynamicRoutes() {
    const routes = []

    // Shopify products
    try {
        const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'ampume.myshopify.com'
        const token  = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN
        if (token) {
            const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Shopify-Storefront-Private-Token': token,
                },
                body: JSON.stringify({
                    query: `query { products(first: 250) { edges { node { handle title description } } } }`,
                }),
            })
            const data = await res.json()
            const products = (data?.data?.products?.edges || []).map(e => e.node).filter(p => p.handle)
            for (const p of products) {
                routes.push({
                    path: `/shop/${p.handle}`,
                    title: `${p.title} | AmpuMe`,
                    description: (p.description || '').replace(/\s+/g, ' ').trim().slice(0, 160),
                })
            }
            console.log(`[prerender] +${products.length} product routes`)
        } else {
            console.warn('[prerender] No Shopify token — skipping product routes')
        }
    } catch (err) {
        console.warn('[prerender] Shopify fetch failed:', err.message)
    }

    // Sanity Knowledge Base — pillars + articles
    try {
        const project = process.env.SANITY_PROJECT_ID || 'uoase9v5'
        const dataset = process.env.SANITY_DATASET || 'production'
        const groq = encodeURIComponent(`{
            "pillars": *[_type == "pillar" && defined(slug.current)]{
                "slug": slug.current,
                title,
                description
            },
            "resources": *[_type == "resource" && defined(slug.current) && defined(pillar->slug.current)]{
                "slug": slug.current,
                "pillar": pillar->slug.current,
                title,
                description,
                excerpt
            }
        }`)
        const res = await fetch(`https://${project}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${groq}`)
        if (res.ok) {
            const data = await res.json()
            const pillars = data?.result?.pillars || []
            const resources = data?.result?.resources || []
            for (const p of pillars) {
                routes.push({
                    path: `/resources/${p.slug}`,
                    title: `${p.title} | AmpuMe Knowledge Base`,
                    description: (p.description || '').slice(0, 160),
                })
            }
            for (const r of resources) {
                routes.push({
                    path: `/resources/${r.pillar}/${r.slug}`,
                    title: `${r.title} | AmpuMe`,
                    description: (r.description || r.excerpt || '').slice(0, 160),
                })
            }
            console.log(`[prerender] +${pillars.length} pillars +${resources.length} articles`)
        }
    } catch (err) {
        console.warn('[prerender] Sanity fetch failed:', err.message)
    }

    return routes
}

// Apply title + meta description overrides to a prerendered HTML shell.
function applySEOOverrides(html, { title, description }) {
    if (!title && !description) return html
    let out = html
    if (title) {
        // Remove any existing helmet / index titles, replace with override.
        out = out.replace(/<title[^>]*>[\s\S]*?<\/title>/g, '')
        out = out.replace('</head>', `  <title>${escapeHtml(title)}</title>\n  </head>`)
    }
    if (description) {
        // Remove any existing description meta, replace with override.
        out = out.replace(/<meta[^>]*name="description"[^>]*>/gi, '')
        out = out.replace(/<meta[^>]*property="og:description"[^>]*>/gi, '')
        out = out.replace(/<meta[^>]*name="twitter:description"[^>]*>/gi, '')
        const tags = [
            `<meta name="description" content="${escapeHtml(description)}" />`,
            `<meta property="og:description" content="${escapeHtml(description)}" />`,
            `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
        ].join('\n  ')
        out = out.replace('</head>', `  ${tags}\n  </head>`)
    }
    return out
}

function escapeHtml(s) {
    return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

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

  const dynamicRoutes = await getDynamicRoutes()
  // Normalize: STATIC_ROUTES is an array of strings, dynamic is array of objects.
  const allRoutes = [
    ...STATIC_ROUTES.map(p => ({ path: p })),
    ...dynamicRoutes,
  ]
  console.log(`[prerender] rendering ${allRoutes.length} routes`)

  for (const route of allRoutes) {
    const url = route.path
    const context = {}
    const { html, helmet } = render(url, context)

    const helmetHead = `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
    `

    let htmlContent = template
      .replace(`<!--app-head-->`, helmetHead)
      .replace(`<!--app-html-->`, html)

    // Inject build-time SEO overrides for dynamic routes whose data is fetched
    // client-side (Shopify products, Sanity articles). This guarantees crawlers
    // see the right title/description even if the body still hydrates later.
    htmlContent = applySEOOverrides(htmlContent, route)

    const filePath = `dist${url === '/' ? '/index.html' : `${url}/index.html`}`
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