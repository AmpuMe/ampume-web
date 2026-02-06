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

  // Try private header first, fall back to public header if it fails
  const headerOptions = isPrivateToken
    ? [
        { 'Shopify-Storefront-Private-Token': SHOPIFY_STOREFRONT_TOKEN },
        { 'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN },
      ]
    : [
        { 'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN },
      ];

  let lastResponse = null;
  let lastData = null;

  for (const authHeader of headerOptions) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
        body: JSON.stringify({ query, variables }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: text || `Shopify returned ${response.status}` };
      }

      // If this attempt succeeded, return immediately
      if (response.ok) {
        return res.status(200).json(data);
      }

      lastResponse = response;
      lastData = data;
    } catch (err) {
      lastData = { error: err.message };
    }
  }

  // All attempts failed - return the last error with debug info
  if (lastResponse) {
    return res.status(lastResponse.status).json({
      ...lastData,
      debug: {
        shopifyStatus: lastResponse.status,
        shopifyStatusText: lastResponse.statusText,
        url,
        tokenPrefix: SHOPIFY_STOREFRONT_TOKEN.substring(0, 6),
        isPrivateToken,
        domain: SHOPIFY_STORE_DOMAIN,
        headersTried: headerOptions.map(h => Object.keys(h)[0]),
      }
    });
  }

  return res.status(500).json({
    ...lastData,
    debug: { url, tokenPrefix: SHOPIFY_STOREFRONT_TOKEN.substring(0, 6), domain: SHOPIFY_STORE_DOMAIN }
  });
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
