// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    details: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch('/api/create-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus("success");
      setFormData({ name: '', category: '', details: '' });
    } else {
      setStatus("error");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Submit a Support Ticket</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Category</label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">Select category</option>
              <option value="Login Issues">Login Issues</option>
              <option value="Data Mismatch">Data Mismatch</option>
              <option value="App Crash / Bug">App Crash / Bug</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Details</label>
            <textarea
              name="details"
              required
              rows="5"
              value={formData.details}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Submit Ticket
          </button>

          {status === 'loading' && <p className="text-sm text-blue-500">Sending ticket...</p>}
          {status === 'success' && <p className="text-sm text-green-600">Ticket submitted successfully!</p>}
          {status === 'error' && <p className="text-sm text-red-600">Failed to submit. Try again.</p>}
        </form>
      </div>
    </main>
  );
}

