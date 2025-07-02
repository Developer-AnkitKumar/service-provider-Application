"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../_provider_components/Navbar";
import Sidebar from "../_provider_components/Sidebar";

export default function ContractorDashboard() {
  const provider = JSON.parse(localStorage.getItem("user")) || { name: "Provider", _id: "" };
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests,setRequests]=useState([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`http://localhost:5000/booking/provider/${provider._id}/bookings`);
        const data = await res.json();
        console.log(data)
        setBookings(data.booking);
        setRequests(data.request);
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

  const feedbacks = bookings
    .filter(booking => booking.feedback && booking.feedback.rating)
    .map(booking => ({
      client: booking.customer?.name || "Client",
      message: booking.feedback.comment || "No comment provided.",
      rating: booking.feedback.rating
    }));

  const upcomingBookings = bookings
    .filter(b => new Date(b.bookingDate) >= new Date() && b.status === "pending")
    .slice(0, 3); // Limit to 3 for now

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="ml-[190px] w-[calc(103%-190px)] bg-gray-100 h-[92vh] px-6 py-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome back, {provider.name}!
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-500">
            <h2 className="text-sm font-medium text-gray-500">Total Bookings</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">{bookings.length}</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-green-500">
            <h2 className="text-sm font-medium text-gray-500">Today's Requests</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {
                bookings.filter(b => {
                  const today = new Date().toISOString().split("T")[0];
                  const bookingDay = new Date(b.bookingDate).toISOString().split("T")[0];
                  console.log(today,bookingDay)
                  return bookingDay === today;
                }).length
              }
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-yellow-500">
            <h2 className="text-sm font-medium text-gray-500">Pending Requests</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {requests.filter(b => b.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-4">Manage Your Services</h3>
            <p className="text-sm text-white/80 mb-4">
              Add, update or remove the services you offer.
            </p>
            <a
              href="/provider/dashboard/manage-services"
              className="bg-white text-blue-600 font-medium px-4 py-2 rounded-md self-start hover:bg-blue-100"
            >
              Go to Services
            </a>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-4">View Service Requests</h3>
            <p className="text-sm text-white/90 mb-4">
              Check out pending and accepted requests from customers.
            </p>
            <a
              href="/provider/dashboard/requests"
              className="bg-white text-yellow-600 font-medium px-4 py-2 rounded-md self-start hover:bg-yellow-100"
            >
              View Requests
            </a>
          </div>
        </div>

        {/* Upcoming Bookings + Feedback */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Upcoming Bookings
            </h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((b, i) => (
                    <li key={i} className="flex justify-between">
                      <span>🛠️ {b.serviceName} - {new Date(b.bookingDate).toLocaleDateString()}, {b.timeSlot}</span>
                      <span className="text-gray-500">Client: {b.customer?.name || "Client"}</span>
                    </li>
                  ))
                ) : (
                  <p>No upcoming bookings.</p>
                )}
              </ul>
            )}
          </div>

          {/* Feedback */}
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Customer Feedback & Ratings
            </h3>
            <ul className="space-y-4 text-sm">
              {feedbacks.length > 0 ? (
                feedbacks.map((fb, i) => (
                  <li key={i} className="border-b pb-3">
                    <div className="font-medium text-gray-700">{fb.client}</div>
                    <p className="text-gray-600 mt-1">{fb.message}</p>
                    <div className="mt-2 text-yellow-500">
                      {Array.from({ length: fb.rating }).map((_, idx) => (
                        <span key={idx}>⭐</span>
                      ))}
                    </div>
                  </li>
                ))
              ) : (
                <p>No feedback available.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
