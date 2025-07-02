"use client";
import React, { useEffect, useState } from 'react';

export default function Bookings() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const provider = JSON.parse(localStorage.getItem("user")) || { _id: "" };

  // Function to handle status update
  async function handleStatusUpdate() {
    try {
      const res = await fetch(`http://localhost:5000/booking/booking/${selectedBooking._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedBooking.status,
          extraCharge: selectedBooking.status === "completed" ? selectedBooking.extraCharge : 0,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Booking updated successfully!");

        // Update UI
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === selectedBooking._id
              ? { ...booking, status: selectedBooking.status, extraCharge: selectedBooking.extraCharge }
              : booking
          )
        );
        setSelectedBooking(null);
      } else {
        alert(result.message || "Failed to update booking");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Something went wrong!");
    }
  }

  // Fetch bookings
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`http://localhost:5000/booking/provider/${provider._id}/bookings-with-customer`);
        const data = await res.json();
        setBookings(data.bookings);
        console.log(data)
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    }

    if (provider._id) {
      fetchBookings();
    }
  }, [provider._id]);

  // Define color styles for different statuses
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    accepted: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="p-10 ml-[170px] h-[75vh]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2 w-[102%]">Bookings</h2>

      <div className="bg-white shadow-lg rounded-lg  w-[105%] overflow-auto h-[77vh]">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Booking ID</th>
              <th className="px-6 py-3 text-left font-semibold">Customer</th>
              <th className="px-6 py-3 text-left font-semibold">Service</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-left font-semibold">Time</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">Loading bookings...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">No bookings found.</td>
              </tr>
            ) : (
              bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{booking._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4">{booking.customerData?.name || "Unknown"}</td>
                  <td className="px-6 py-4">{booking.serviceName}</td>
                  <td className="px-6 py-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{booking.timeSlot}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[booking.status?.toLowerCase()] || "bg-gray-200 text-gray-600"}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="bg-blue-500 text-white text-xs px-4 py-2 rounded-full hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Booking Details */}
      {selectedBooking && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[400px] p-6 rounded-2xl shadow-2xl relative animate-fadeIn">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Booking Details</h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Booking ID:</span> {selectedBooking._id}</p>
              <p><span className="font-medium">Service:</span> {selectedBooking.serviceName}</p>
              <p><span className="font-medium">Date:</span> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {selectedBooking.timeSlot}</p>
              <p>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColor[selectedBooking.status?.toLowerCase()] || "bg-gray-200 text-gray-600"}`}>
                  {selectedBooking.status}
                </span>
              </p>
            </div>

            {/* Customer Details */}
            {selectedBooking.customerData && (
              <>
                <h4 className="text-xl font-semibold mt-6 border-b pb-1 text-gray-700">Customer Details</h4>
                <div className="mt-3 space-y-2 text-gray-700">
                  <p><span className="font-medium">Name:</span> {selectedBooking.customerData.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedBooking.customerData.email}</p>
                  {selectedBooking.contactNumber && (
                    <p><span className="font-medium">Phone:</span> {selectedBooking.contactNumber}</p>
                  )}
                  {selectedBooking.address && (
                    <p><span className="font-medium">Address:</span> {selectedBooking.address}</p>
                  )}
                  {selectedBooking.customerData.profilePicture && (
                    <div className="mt-2">
                      <span className="font-medium">Profile Picture:</span>
                      <img
                        src={selectedBooking.customerData.profilePicture}
                        alt="Customer Profile"
                        className="mt-1 w-20 h-20 object-cover rounded-full border"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Display payment details if booking is completed */}
            {selectedBooking.status === "completed" && (
              <>
                <div className="mt-6 space-y-2 text-gray-700">
                  <p><span className="font-medium">Final Charge:</span> {selectedBooking.finalCharge}</p>
                  <p><span className="font-medium">Payment Status:</span> {selectedBooking.paymentStatus || "Not Paid"}</p>
                </div>
              </>
            )}

            {/* Action buttons for "Pending" status */}
            {selectedBooking.status === "pending" && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Update Booking Status</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedBooking({ ...selectedBooking, status: "completed", showExtraCharge: true })}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => setSelectedBooking({ ...selectedBooking, status: "cancelled", showExtraCharge: false })}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm"
                  >
                    Mark as Cancelled
                  </button>
                </div>
              </div>
            )}

            {/* Extra charge input for "Completed" status */}
            {selectedBooking.status === "completed" && selectedBooking.showExtraCharge && (
              <div className="mt-4">
                <label className="block text-sm text-gray-700">Extra Charge (if any):</label>
                <input
                  type="number"
                  value={selectedBooking.extraCharge || ""}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, extraCharge: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border rounded-lg text-gray-800"
                />
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-full"
              >
                Close
              </button>
              <button
                onClick={handleStatusUpdate}
                className="bg-blue-500 text-white px-6 py-2 rounded-full"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
