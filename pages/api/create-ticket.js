export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { name, email, subject, description } = req.body;

  const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN;
  const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL;
  const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;

  const response = await fetch(`https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}`).toString("base64"),
    },
    body: JSON.stringify({
      ticket: {
        requester: { name, email },
        subject,
        comment: { body: description },
      },
    }),
  });

  const data = await response.json();

  if (response.ok) {
    res.status(200).json({ message: "Ticket created successfully!" });
  } else {
    res.status(500).json({ message: "Failed to create ticket", error: data });
  }
}
