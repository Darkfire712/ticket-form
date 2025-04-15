import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", description: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/create-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setMessage(data.message || "Submitted!");
  };

  return (
    <main style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h1>Submit a Ticket</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} /><br />
        <input placeholder="Email" required onChange={e => setFormData({ ...formData, email: e.target.value })} /><br />
        <input placeholder="Subject" required onChange={e => setFormData({ ...formData, subject: e.target.value })} /><br />
        <textarea placeholder="Description" required onChange={e => setFormData({ ...formData, description: e.target.value })} /><br />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </main>
  );
}
