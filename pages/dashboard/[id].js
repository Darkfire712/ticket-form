import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const TicketDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Extract ticket ID from the URL
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // If there's no ID, exit early

    const fetchTicketData = async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();

        if (res.ok) {
          setTicket(data.ticket);
          setComments(data.comments);
        } else {
          setError('Failed to load ticket details');
        }
      } catch (err) {
        setError('Error fetching ticket data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [id]); // Only run when the ID changes

  if (loading) return <div>Loading ticket details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Ticket Details</h1>
      {ticket && (
        <div className="ticket-details p-4 border rounded-md mb-6">
          <h2 className="text-xl font-semibold">{ticket.subject}</h2>
          <p className="text-sm text-gray-500 mb-2">Status: {ticket.status}</p>
          <p className="text-md">{ticket.description}</p>
        </div>
      )}

      <div className="comments">
        <h3 className="text-2xl font-semibold mb-2">Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment p-4 mb-4 border rounded-md">
              <p className="font-medium">{comment.author}</p>
              <p>{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
