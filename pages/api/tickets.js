// pages/api/tickets/[id].js

export default async function handler(req, res) {
  const { id } = req.query; // Extract ticket ID from the URL

  try {
    // You should replace this with actual data fetching from Zendesk or your database
    const ticketData = await fetchZendeskTicket(id); // Simulate a function to fetch the ticket
    const commentsData = await fetchZendeskComments(id); // Simulate a function to fetch the comments

    // Send back the ticket and comments as a JSON response
    res.status(200).json({ ticket: ticketData, comments: commentsData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticket data' });
    console.error(error);
  }
}


