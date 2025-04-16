export default async function handler(req, res) {
  const { id } = req.query;

  console.log('⏳ Incoming request for ticket ID:', id);

  const zendeskDomain = process.env.ZENDESK_DOMAIN;
  const zendeskEmail = process.env.ZENDESK_EMAIL;
  const zendeskApiToken = process.env.ZENDESK_API_TOKEN;

  console.log('🌍 Env check:', {
    zendeskDomain,
    zendeskEmail,
    hasToken: !!zendeskApiToken,
  });

  if (!zendeskDomain || !zendeskEmail || !zendeskApiToken) {
    return res.status(500).json({ message: 'Missing environment variables' });
  }

  const auth = Buffer.from(`${zendeskEmail}/token:${zendeskApiToken}`).toString('base64');

  try {
    const ticketUrl = `https://${zendeskDomain}.zendesk.com/api/v2/tickets/${id}.json`;
    const commentsUrl = `https://${zendeskDomain}.zendesk.com/api/v2/tickets/${id}/comments.json`;

    console.log('🎯 Hitting:', ticketUrl);
    const ticketRes = await fetch(ticketUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('💬 Hitting:', commentsUrl);
    const commentsRes = await fetch(commentsUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const ticketText = await ticketRes.text();
    const commentsText = await commentsRes.text();

    console.log('✅ Ticket status:', ticketRes.status);
    console.log('✅ Comments status:', commentsRes.status);

    if (!ticketRes.ok || !commentsRes.ok) {
      return res.status(500).json({
        message: 'Zendesk API call failed',
        ticketStatus: ticketRes.status,
        commentStatus: commentsRes.status,
        ticketBody: ticketText,
        commentsBody: commentsText,
      });
    }

    const ticketData = JSON.parse(ticketText);
    const commentsData = JSON.parse(commentsText);

    res.status(200).json({
      ticket: ticketData.ticket,
      comments: commentsData.comments,
    });
  } catch (error) {
    console.error('❌ Uncaught Error:', error);
    res.status(500).json({ message: 'Failed to fetch ticket', error: error.message });
  }
}
