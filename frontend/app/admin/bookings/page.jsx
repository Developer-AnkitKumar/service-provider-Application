'use client';

import React, { useEffect, useState } from 'react';
import SideBar from '../_components/SideBar';

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Accepted: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const paymentStyles = {
  Pending: 'bg-red-100 text-red-800',
  Paid: 'bg-green-100 text-green-800',
};

const AdminBookings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:5000/admin/bookings'); // Adjust if you're using a proxy or full API URL
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 p-8 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-[200px]' : 'ml-0'}`}>
        <h2 className="text-2xl font-bold mb-6 text-center">All Bookings</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Provider</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Service</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Payment</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">{booking.customerName}</td>
                    <td className="py-4 px-6">{booking.providerName}</td>
                    <td className="py-4 px-6">{booking.serviceName}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[booking.status] || ''}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStyles[booking.paymentStatus] || ''}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">₹{booking.paymentAmount}</td>
                    <td className="py-4 px-6">
                      {booking.rating ? (
                        <span className="text-yellow-500 font-bold">{booking.rating} ★</span>
                      ) : (
                        <span className="text-gray-400">Not Rated</span>
                      )}
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
};

export default AdminBookings;
