// Build-time sitemap generator.
//
// Runs after the prerender step. Fetches every public route — including
// dynamic Shopify product pages and Sanity Knowledge Base pages — and
// writes a complete sitemap.xml into dist/.
//
// Falls back to a static-only sitemap if the upstream APIs are unreachable
// so the build never breaks because of a transient network blip.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const SITE = 'https://ampume.com'

// Static URLs, with default priority + change frequency hints.
const STATIC_URLS = [
  { loc: '/',                          priority: '1.0', changefreq: 'weekly'  },
  { loc: '/shop',                      priority: '0.9', changefreq: 'weekly'  },
  { loc: '/shop/liners',               priority: '0.8', changefreq: 'weekly'  },
  { loc: '/shop/socks',                priority: '0.8', changefreq: 'weekly'  },
  { loc: '/shop/sleeves',              priority: '0.8', changefreq: 'weekly'  },
  { loc: '/shop/accessories',          priority: '0.8', changefreq: 'weekly'  },
  { loc: '/resources',                 priority: '0.9', changefreq: 'weekly'  },
  { loc: '/ask-ampume',                priority: '0.8', changefreq: 'monthly' },
  { loc: '/telemedicine',              priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact',                   priority: '0.5', changefreq: 'yearly'  },
  { loc: '/privacy-policy',            priority: '0.3', changefreq: 'yearly'  },
  { loc: '/terms-of-service',          priority: '0.3', changefreq: 'yearly'  },
  { loc: '/accessibility-statement',   priority: '0.3', changefreq: 'yearly'  },
]

const SHOPIFY_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'ampume.myshopify.com'
const SHOPIFY_TOKEN  = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || ''
const SHOPIFY_API_VERSION = '2024-10'
// Live serverless proxy — used as a fallback when no build-time token is set
// (e.g. when VITE_SHOPIFY_STOREFRONT_TOKEN is configured as a Function-only
// env var on Vercel). The proxy already has the runtime token, so we can
// piggyback on it to keep products in the sitemap regardless.
const SHOPIFY_PROXY = 'https://www.ampume.com/api/shopify'

const SANITY_PROJECT = process.env.SANITY_PROJECT_ID || 'uoase9v5'
const SANITY_DATASET = process.env.SANITY_DATASET || 'production'

const SHOPIFY_QUERY = `
  query AllProducts {
    products(first: 250) {
      edges { node { handle updatedAt } }
    }
  }
`

function shapeShopifyEdges(edges) {
  return edges
    .filter(e => e?.node?.handle && !e.node.handle.toLowerCase().includes('test'))
    .map(e => ({
      loc: `/shop/${e.node.handle}`,
      lastmod: e.node.updatedAt ? e.node.updatedAt.split('T')[0] : null,
      priority: '0.7',
      changefreq: 'weekly',
    }))
}

async function fetchShopifyDirect() {
  if (!SHOPIFY_TOKEN) return null
  try {
    const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query: SHOPIFY_QUERY }),
    })
    const data = await res.json()
    const edges = data?.data?.products?.edges
    if (!Array.isArray(edges) || edges.length === 0) return null
    return shapeShopifyEdges(edges)
  } catch (err) {
    console.warn('[sitemap] Shopify direct fetch failed:', err.message)
    return null
  }
}

async function fetchShopifyViaProxy() {
  try {
    const res = await fetch(SHOPIFY_PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: SHOPIFY_QUERY }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const edges = data?.data?.products?.edges
    if (!Array.isArray(edges) || edges.length === 0) return null
    return shapeShopifyEdges(edges)
  } catch (err) {
    console.warn('[sitemap] Shopify proxy fetch failed:', err.message)
    return null
  }
}

async function fetchShopifyProducts() {
  const direct = await fetchShopifyDirect()
  if (direct && direct.length > 0) {
    console.log(`[sitemap] Shopify direct: ${direct.length} products`)
    return direct
  }
  const proxied = await fetchShopifyViaProxy()
  if (proxied && proxied.length > 0) {
    console.log(`[sitemap] Shopify via proxy: ${proxied.length} products`)
    return proxied
  }
  console.warn('[sitemap] No products fetched (token + proxy both empty)')
  return []
}

async function fetchSanityRoutes() {
  // Pillars + resources, with their slugs and last-updated stamps.
  const query = encodeURIComponent(`{
    "pillars": *[_type == "pillar" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
    "resources": *[_type == "resource" && defined(slug.current) && defined(pillar->slug.current)]{
      "slug": slug.current,
      "pillar": pillar->slug.current,
      _updatedAt
    }
  }`)
  const url = `https://${SANITY_PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn('[sitemap] Sanity returned', res.status)
      return []
    }
    const data = await res.json()
    const out = []
    for (const p of data?.result?.pillars || []) {
      out.push({
        loc: `/resources/${p.slug}`,
        lastmod: p._updatedAt ? p._updatedAt.split('T')[0] : null,
        priority: '0.7',
        changefreq: 'monthly',
      })
    }
    for (const r of data?.result?.resources || []) {
      out.push({
        loc: `/resources/${r.pillar}/${r.slug}`,
        lastmod: r._updatedAt ? r._updatedAt.split('T')[0] : null,
        priority: '0.6',
        changefreq: 'monthly',
      })
    }
    return out
  } catch (err) {
    console.warn('[sitemap] Sanity fetch failed:', err.message)
    return []
  }
}

function entry({ loc, priority, changefreq, lastmod }) {
  const lines = [`  <url>`, `    <loc>${SITE}${loc}</loc>`]
  if (lastmod)    lines.push(`    <lastmod>${lastmod}</lastmod>`)
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`)
  if (priority)   lines.push(`    <priority>${priority}</priority>`)
  lines.push(`  </url>`)
  return lines.join('\n')
}

;(async () => {
  console.log('[sitemap] generating…')
  const [products, sanity] = await Promise.all([fetchShopifyProducts(), fetchSanityRoutes()])

  // If both upstreams returned nothing, leave the public/ static fallback
  // alone instead of overwriting it with a partial (static-only) sitemap.
  if (products.length === 0 && sanity.length === 0) {
    console.warn('[sitemap] both upstreams empty — keeping static public/sitemap.xml')
    return
  }

  const all = [...STATIC_URLS, ...products, ...sanity]

  // De-dupe by loc just in case
  const seen = new Set()
  const unique = all.filter(u => {
    if (seen.has(u.loc)) return false
    seen.add(u.loc)
    return true
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique.map(entry).join('\n')}
</urlset>
`

  const distPath = toAbsolute('dist/sitemap.xml')
  fs.writeFileSync(distPath, xml)
  console.log(`[sitemap] wrote ${unique.length} URLs (${products.length} products, ${sanity.length} resources) to ${distPath}`)
})()
