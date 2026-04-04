// Vercel serverless function - proxies Sanity GROQ queries
// This keeps the project ID and dataset server-side

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PROJECT_ID = process.env.SANITY_PROJECT_ID;
  const DATASET = process.env.SANITY_DATASET || 'production';
  const API_VERSION = '2024-01-01';

  if (!PROJECT_ID) {
    return res.status(500).json({ error: 'Sanity project ID not configured' });
  }

  const { query, params } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'GROQ query is required' });
  }

  const url = new URL(`https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`);
  url.searchParams.set('query', query);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    });
  }

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Cache CDN content: 60s fresh, 5min stale-while-revalidate
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Sanity proxy error:', error);
    return res.status(500).json({
      error: 'Failed to fetch from Sanity',
      message: error.message,
    });
  }
}
