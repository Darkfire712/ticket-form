export default async function handler(req, res) {
  const { id } = req.query;

  const zendeskDomain = process.env.ZENDESK_DOMAIN;
  const zendeskEmail = process.env.ZENDESK_EMAIL;
  const zendeskApiToken = process.env.ZENDESK_API_TOKEN;
  const auth = Buffer.from(`${zendeskEmail}/token:${zendeskApiToken}`).toString('base64');

  try {
    // Fetch ticket details
    const ticketRes = await fetch(`https://${zendeskDomain}.zendesk.com/api/v2/tickets/${id}.json`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!ticketRes.ok) {
      throw new Error('Failed to fetch ticket');
    }

    const ticketData = await ticketRes.json();

    // Fetch ticket comments
    const commentRes = await fetch(`https://${zendeskDomain}.zendesk.com/api/v2/tickets/${id}/comments.json`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!commentRes.ok) {
      throw new Error('Failed to fetch comments');
    }

    const commentData = await commentRes.json();

    res.status(200).json({
      ticket: ticketData.ticket,
      comments: commentData.comments,
    });
  } catch (err) {
    console.error('Error fetching ticket:', err.message);
    res.status(500).json({ message: 'Error fetching ticket data', error: err.message });
  }
}

