import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TicketDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTicketDetails() {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();
        setTicket(data.ticket);
        setComments(data.comments);
      } catch (err) {
        console.error('Error fetching ticket:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTicketDetails();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!ticket) return <div className="p-6">Ticket not found</div>;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-[#0050C8] hover:underline">← Back to Dashboard</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-[#0050C8] mb-2">{ticket.subject}</h2>
          <p className="text-sm text-gray-500 mb-4">Status: <span className="capitalize">{ticket.status}</span></p>
          <p className="text-gray-800 mb-6">{ticket.description || ticket.comment?.body}</p>

          <h3 className="text-md font-semibold mb-2">Responses</h3>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 border border-gray-200 rounded p-3">
                <p className="text-sm text-gray-600">{new Date(comment.created_at).toLocaleString()}</p>
                <p className="mt-1 text-gray-800">{comment.body}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="text-sm text-gray-500">No responses yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
