import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TicketDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTicket() {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();

        if (res.ok) {
          setTicket(data.ticket);
          setComments(data.comments);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTicket();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#0050C8] mb-6">Ticket Details</h1>

        {ticket && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Subject: {ticket.subject}</h2>
              <p className="text-sm text-gray-500">Status: <span className="font-bold">{ticket.status}</span></p>
              <p className="mt-3 text-gray-700">{ticket.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Comments:</h3>
              {comments.length > 0 ? (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment.id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                      <p className="text-sm text-gray-500">{comment.author_id === ticket.requester_id ? 'You' : 'Agent'}</p>
                      <p className="mt-2">{comment.body}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </>
        )}

        <div className="mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-[#0050C8] text-white rounded-lg hover:bg-[#0042A3] transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

