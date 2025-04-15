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

    // Check if the ticket request was successful
    if (!ticketRes.ok) {
      const errorText = await ticketRes.text();
      console.error('Ticket Fetch Error:', errorText);  // Log the detailed error message
      return res.status(ticketRes.status).json({ message: 'Failed to fetch ticket data', error: errorText });
    }

    const ticketData = await ticketRes.json();

    // Fetch ticket comments
    const commentsRes = await fetch(`https://${subdomain}.zendesk.com/api/v2/tickets/${id}/comments.json`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if the comments request was successful
    if (!commentsRes.ok) {
      const errorText = await commentsRes.text();
      console.error('Comments Fetch Error:', errorText);  // Log the detailed error message
      return res.status(commentsRes.status).json({ message: 'Failed to fetch comments', error: errorText });
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
    console.error('Internal Server Error:', err); // Log any other internal errors
    res.status(500).json({ message: 'Error fetching ticket data', error: err.message });
  }
}
