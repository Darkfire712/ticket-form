import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const TicketDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the URL
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UseEffect runs when the component is loaded and when `id` is updated
  useEffect(() => {
    // Make sure the ID is available before fetching data
    if (!id) return;

    // Function to fetch ticket data from API
    const fetchTicketData = async () => {
      try {
        // Send request to your API (this will be a backend route)
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();

        // If the response is successful, update state
        if (res.ok) {
          setTicket(data.ticket);
          setComments(data.comments);
        } else {
          setError('Failed to fetch ticket details');
        }
      } catch (err) {
        setError('Error fetching ticket details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData(); // Call the function to fetch ticket data
  }, [id]); // This effect runs when the `id` changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Ticket Details</h1>
      {ticket && (
        <div className="ticket-details">
          <h2 className="text-xl font-bold">{ticket.subject}</h2>
          <p className="mb-2">{ticket.description}</p>
          <p className="text-sm text-gray-500">Status: {ticket.status}</p>
        </div>
      )}

      <div className="comments mt-6">
        <h3 className="text-2xl font-semibold mb-2">Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment mb-4 p-4 border rounded-md">
              <p className="font-medium">{comment.author}</p>
              <p className="text-sm text-gray-700">{comment.body}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;




