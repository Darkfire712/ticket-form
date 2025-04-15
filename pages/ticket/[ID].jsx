import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const TicketDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the URL
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Don't run if ID is not yet available

    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();
        console.log("Fetched data:", data); // Log the data for debugging

        if (res.ok) {
          setTicket(data.ticket);
          setComments(data.comments);
        } else {
          setError(data.message || 'Failed to fetch ticket');
          console.error(data);
        }
      } catch (error) {
        setError('Error fetching ticket data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]); // This effect runs when the `id` changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Ticket Details</h1>
      <div>
        <h2>{ticket?.subject}</h2>
        <p>{ticket?.description}</p>
      </div>

      <div>
        <h3>Comments</h3>
        {comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.body}</p>
            <p><strong>{comment.author}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketDetails;



