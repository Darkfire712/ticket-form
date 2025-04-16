export default async function handler(req, res) {
  const zendeskDomain = process.env.ZENDESK_DOMAIN;
  const zendeskEmail = process.env.ZENDESK_EMAIL;
  const zendeskApiToken = process.env.ZENDESK_API_TOKEN;

  const auth = Buffer.from(`${zendeskEmail}/token:${zendeskApiToken}`).toString('base64');

  try {
    const response = await fetch(`https://${zendeskDomain}.zendesk.com/api/v2/tickets.json`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const rawText = await response.text(); // Get the full response text

    if (!response.ok) {
      console.error('Zendesk API Error:', rawText); // Log the actual API response error
      return res.status(response.status).json({
        message: 'Zendesk API call failed',
        error: rawText,
      });
    }

    const data = JSON.parse(rawText);
    res.status(200).json({ tickets: data.tickets });
  } catch (err) {
    console.error('Server Error:', err);  // Log the error from fetch()
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}

