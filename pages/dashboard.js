import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch('/api/tickets');
        const data = await res.json();
        setTickets(data.tickets);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0050C8]">My Tickets</h1>
          <Link href="/new-ticket">
            <button className="bg-[#FF671F] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#e65c1c]">
              + Create Ticket
            </button>
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading tickets...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                    <td className="px-4 py-3 capitalize text-sm text-[#0050C8]">{ticket.status}</td>
                    <td className="px-4 py-3 text-sm">{new Date(ticket.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Link href={`/ticket/${ticket.id}`} className="text-[#FF671F] hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
