// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // Fetch all bookings from backend API
  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings');
      const data = await response.json();
      if (Array.isArray(data)) {
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update Booking Status (PUT)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Delete Booking (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBookings(bookings.filter(b => b._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  // Filter Logic
  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  // Summary Metrics
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const approvedCount = bookings.filter(b => b.status === 'Approved').length;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Top Header & Refresh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Management Console</h2>
          <p className="text-gray-500 text-sm mt-1">Manage, filter, and modify client requests directly from MongoDB.</p>
        </div>
        <button
          onClick={fetchBookings}
          className="self-start md:self-auto bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition flex items-center gap-2"
        >
          🔄 Refresh Live Sync
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-yellow-600">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-700 mt-2">{pendingCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-green-600">Approved Sessions</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{approvedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-4">
        {['All', 'Pending', 'Approved', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              filter === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Loading database records...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No bookings found for filter "{filter}".</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Client Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-gray-900">{b.clientName}</td>
                    <td className="py-4 px-6 text-gray-600">{b.email}</td>
                    <td className="py-4 px-6 text-gray-800 font-medium">{b.service}</td>
                    <td className="py-4 px-6 text-gray-600">{b.date}</td>
                    <td className="py-4 px-6">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${
                          b.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-300' :
                          b.status === 'Completed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded transition"
                      >
                        Delete
                      </button>
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