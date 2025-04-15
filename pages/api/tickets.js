export default async function handler(req, res) {
  const { id } = req.query;

  const subdomain = process.env.ZENDESK_SUBDOMAIN;
  const email = process.env.ZENDESK_EMAIL;
  const apiToken = process.env.ZENDESK_API_TOKEN;

  const auth = Buffer.from(`${email}/token:${apiToken}`).toString('base64');

  try {
    // Fetch ticket details
    const ticketRes = await fetch(`https://${subdomain}.zendesk.com/api/v2/tickets/${id}.json`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!ticketRes.ok) {
      return res.status(ticketRes.status).json({ message: 'Failed to fetch ticket data' });
    }

    const ticketData = await ticketRes.json();

    // Fetch ticket comments
    const commentsRes = await fetch(`https://${subdomain}.zendesk.com/api/v2/tickets/${id}/comments.json`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!commentsRes.ok) {
      return res.status(commentsRes.status).json({ message: 'Failed to fetch comments' });
    }

    const commentsData = await commentsRes.json();

    const formattedComments = commentsData.comments.map((c) => ({
      id: c.id,
      author: c.author_id,
      body: c.body,
      created_at: c.created_at,
    }));

    return res.status(200).json({ ticket: ticketData.ticket, comments: formattedComments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching ticket data' });
  }
}



