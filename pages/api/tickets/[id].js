export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const ticketData = await fetchZendeskTicket(id); // Simulate fetching a ticket by ID from Zendesk
    const commentsData = await fetchZendeskComments(id); // Simulate fetching ticket comments from Zendesk

    res.status(200).json({ ticket: ticketData, comments: commentsData });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ticket data', error: err.message });
  }
}
