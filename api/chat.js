export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      return res.status(openaiRes.status).json({
        error: errorData.error?.message || 'Failed to get response from OpenAI'
      });
    }

    const data = await openaiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
} 