// Vercel serverless function - proxies Storefront API requests
// This keeps the private token server-side and avoids CORS issues

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'ampume.myshopify.com';
  const SHOPIFY_STOREFRONT_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
  const API_VERSION = '2025-01';

  if (!SHOPIFY_STOREFRONT_TOKEN) {
    return res.status(500).json({
      error: 'Storefront API token not configured',
      debug: {
        hasDomain: !!SHOPIFY_STORE_DOMAIN,
        hasToken: false,
      }
    });
  }

  const { query, variables } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'GraphQL query is required' });
  }

  const url = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
  const isPrivateToken = SHOPIFY_STOREFRONT_TOKEN.startsWith('shpss_');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(isPrivateToken
          ? { 'Shopify-Storefront-Private-Token': SHOPIFY_STOREFRONT_TOKEN }
          : { 'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN }
        ),
      },
      body: JSON.stringify({ query, variables }),
    });

    // Try to parse as JSON, fall back to text
    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { error: text || `Shopify returned ${response.status}` };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        ...data,
        debug: {
          shopifyStatus: response.status,
          shopifyStatusText: response.statusText,
          url,
          tokenPrefix: SHOPIFY_STOREFRONT_TOKEN.substring(0, 6),
          isPrivateToken,
          domain: SHOPIFY_STORE_DOMAIN,
        }
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Shopify proxy error:', error);
    return res.status(500).json({
      error: 'Failed to fetch from Shopify',
      message: error.message,
      debug: {
        url,
        tokenPrefix: SHOPIFY_STOREFRONT_TOKEN.substring(0, 6),
        domain: SHOPIFY_STORE_DOMAIN,
      }
    });
  }
}
