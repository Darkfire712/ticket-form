export default async function handler(req, res) {
  const { id } = req.query;

  const zendeskDomain = process.env.ZENDESK_DOMAIN;
  const zendeskEmail = process.env.ZENDESK_EMAIL;
  const zendeskApiToken = process.env.ZENDESK_API_TOKEN;

  if (!zendeskDomain || !zendeskEmail || !zendeskApiToken) {
    return res.status(500).json({ message: 'Missing environment variables' });
  }

  const auth = Buffer.from(`${zendeskEmail}/token:${zendeskApiToken}`).toString('base64');

  try {
    const ticketRes = await fetch(`https://${zendeskDomain}.zendesk.com/api/v2/tickets/${id}.json`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const commentsRes = await fetch(`https://${zendeskDomain}.zendesk.com/api/v2/tickets/${id}/comments.json`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const ticketBody = await ticketRes.text();
    const commentsBody = await commentsRes.text();

    console.log('🎟️ Ticket Response:', ticketRes.status, ticketBody);
    console.log('💬 Comments Response:', commentsRes.status, commentsBody);

    if (!ticketRes.ok || !commentsRes.ok) {
      return res.status(500).json({
        message: 'Zendesk API call failed',
        ticketStatus: ticketRes.status,
        commentStatus: commentsRes.status,
        ticketBody,
        commentsBody,
      });
    }

    const ticketData = JSON.parse(ticketBody);
    const commentsData = JSON.parse(commentsBody);

    res.status(200).json({
      ticket: ticketData.ticket,
      comments: commentsData.comments,
    });
  } catch (error) {
    console.error('❌ Error fetching ticket:', error);
    res.status(500).json({ message: 'Failed to fetch ticket', error: error.message });
  }
}
