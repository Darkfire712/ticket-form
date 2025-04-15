export default async function handler(req, res) {
  const { id } = req.query; // Extract the ticket ID from the URL

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN;
  const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL;
  const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;

  const auth = Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}`).toString('base64');

  try {
    // Fetch the ticket details
    const zendeskRes = await fetch(
      `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${id}.json`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await zendeskRes.json();

    if (!zendeskRes.ok) {
      return res.status(zendeskRes.status).json({ message: 'Failed to fetch ticket', error: data });
    }

    // Fetch the comments for the ticket
    const commentsRes = await fetch(
      `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${id}/comments.json`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const commentsData = await commentsRes.json();

    if (!commentsRes.ok) {
      return res.status(commentsRes.status).json({ message: 'Failed to fetch comments', error: commentsData });
    }

    res.status(200).json({
      ticket: data.ticket,
      comments: commentsData.comments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
}

