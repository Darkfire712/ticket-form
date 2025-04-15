export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN;
  const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL;
  const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;

  const auth = Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}`).toString('base64');

  try {
    // Fetch the ticket details
    const zendeskTicketRes = await fetch(
      `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${id}.json`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const ticketData = await zendeskTicketRes.json();

    if (!zendeskTicketRes.ok) {
      return res.status(zendeskTicketRes.status).json({ message: 'Failed to fetch ticket', error: ticketData });
    }

    // Fetch the comments for this ticket
    const zendeskCommentsRes = await fetch(
      `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${id}/comments.json`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const commentsData = await zendeskCommentsRes.json();

    if (!zendeskCommentsRes.ok) {
      return res.status(zendeskCommentsRes.status).json({ message: 'Failed to fetch comments', error: commentsData });
    }

    res.status(200).json({ ticket: ticketData.ticket, comments: commentsData.comments });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}
