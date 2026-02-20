// Vercel serverless function - handles contact form submissions
// Adds subscriber to MailerLite with contact form tag

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!email || !name || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_CONTACT_GROUP_ID;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: {
          name: firstName,
          last_name: lastName,
          ...(subject ? { contact_subject: subject } : {}),
          ...(message ? { contact_message: message } : {}),
        },
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
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
