export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, category, details } = req.body;

  if (!name || !category || !details) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN;
  const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL;
  const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;

  const auth = Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}`).toString('base64');

  const ticketPayload = {
    ticket: {
      subject: `Issue: ${category} - ${name}`,
      comment: {
        body: details,
      },
      requester: {
        name,
        email: `${name.replace(/\s+/g, '_')}@noemail.cars24.in` // dummy email format
      },
    },
  };

  try {
    const zendeskRes = await fetch(`https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(ticketPayload),
    });

    const data = await zendeskRes.json();

    if (!zendeskRes.ok) {
      return res.status(zendeskRes.status).json({
        message: 'Failed to create ticket',
        error: data,
      });
    }

    return res.status(200).json({ message: 'Ticket created', ticket: data.ticket });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
}

