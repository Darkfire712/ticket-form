import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/tickets');
        const data = await res.json();

        if (res.ok) {
          setTickets(data.tickets);
        } else {
          throw new Error(data.message || 'Failed to fetch tickets');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleClick = (id) => {
    router.push(`/dashboard/${id}`);
  };

  if (loading) return <div className="p-8">Loading tickets...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Support Dashboard</h1>
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleClick(ticket.id)}
              className="cursor-pointer p-4 border rounded shadow hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-semibold">{ticket.subject}</h2>
              <p className="text-sm text-gray-600">Status: {ticket.status}</p>
              <p className="text-sm text-gray-400">ID: {ticket.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

