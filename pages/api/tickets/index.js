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

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    const data = await response.json();
    res.status(200).json({ tickets: data.tickets });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err.message });
  }
}
