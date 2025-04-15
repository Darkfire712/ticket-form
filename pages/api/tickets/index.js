export default async function handler(req, res) {
  try {
    const tickets = await fetchZendeskTickets(); // Simulate fetching tickets from Zendesk
    res.status(200).json({ tickets });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err.message });
  }
}
