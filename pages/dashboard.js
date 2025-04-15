import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch ticket list from the API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/tickets');
        const data = await res.json();

        if (res.ok) {
          setTickets(data.tickets); // Assuming the API returns a list of tickets
        } else {
          setError('Failed to load tickets');
        }
      } catch (err) {
        setError('Error fetching tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleTicketClick = (id) => {
    router.push(`/ticket/${id}`); // Redirect to ticket detail page
  };

  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket p-4 border rounded-md cursor-pointer hover:bg-gray-100"
              onClick={() => handleTicketClick(ticket.id)}
            >
              <h3 className="text-xl font-semibold">{ticket.subject}</h3>
              <p className="text-sm text-gray-500">Status: {ticket.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

