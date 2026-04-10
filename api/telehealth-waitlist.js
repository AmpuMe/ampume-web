// Vercel serverless function - handles telehealth waitlist signups
// Adds subscriber to MailerLite "Telehealth Waitlist" group

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_TELEHEALTH_GROUP_ID;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        groups: GROUP_ID ? [GROUP_ID] : [],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite Error:', data);
      return res.status(400).json({ error: data.message || 'Failed to submit' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telehealth waitlist error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
