// Vercel serverless proxy for CustomGPT API
// Keeps API key server-side, streams SSE responses to the browser

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.CUSTOMGPT_API_KEY;
  const projectId = process.env.CUSTOMGPT_PROJECT_ID || '88174';

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { messages, stream = true } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const url = `https://app.customgpt.ai/api/v1/projects/${projectId}/chat/completions`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': stream ? 'text/event-stream' : 'application/json',
      },
      body: JSON.stringify({
        messages,
        stream,
        lang: 'en',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CustomGPT API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'AI service error',
        details: response.status,
      });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Pipe the Node.js readable stream directly to the response
      response.body.on('data', (chunk) => {
        res.write(chunk);
      });
      response.body.on('end', () => {
        res.end();
      });
      response.body.on('error', (err) => {
        console.error('Stream error:', err);
        res.end();
      });
    } else {
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error('Chat proxy error:', error);
    return res.status(500).json({ error: 'Failed to connect to AI service' });
  }
}
