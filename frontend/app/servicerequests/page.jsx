"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../_provider_components/Navbar";
import Sidebar from "../_provider_components/Sidebar";

export default function ServiceRequests() {
  const providerId = JSON.parse(localStorage.getItem("user"))?._id;
  const [requests, setRequests] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");

  useEffect(() => {
    fetch(`http://localhost:5000/services/provider/${providerId}/requests`)
      .then((res) => res.json())
      .then((data) => {
        if (data.requests) {
          setRequests(data.requests);
        }
      })
      .catch((err) => console.error("Failed to load requests:", err));
  }, [providerId]);

  const updateStatus = async (id, status) => {
    const res = await fetch(`http://localhost:5000/services/request/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (data.request) {
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: data.request.status } : r))
      );
    }
  };

  const filteredRequests =
    activeStatus === "all"
      ? requests
      : requests.filter((r) => r.status === activeStatus);

  const statusColors = {
    pending: "text-yellow-600",
    accepted: "text-green-600",
    rejected: "text-red-600",
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="h-[92vh] bg-gray-100 py-10 px-6 ml-[190px] overflow-y-auto w-[90%]">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Service Requests
        </h1>

        {/* 🔘 Filter Buttons */}
        <div className="flex gap-4 mb-6">
          {["all", "pending", "accepted", "rejected"].map((status) => {
            const colors = {
              all: "bg-gray-500 hover:bg-gray-600",
              pending: "bg-yellow-500 hover:bg-yellow-600",
              accepted: "bg-green-500 hover:bg-green-600",
              rejected: "bg-red-500 hover:bg-red-600",
            };

            const isActive = activeStatus === status;

            return (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`capitalize px-4 py-2 rounded-lg font-medium shadow transition ${
                  isActive
                    ? `${colors[status]} text-white`
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* 📦 Request Cards */}
        <div className="grid gap-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200 hover:shadow-lg transition"
              >
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {req.service.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Request ID:</span> {req._id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">User:</span>{" "}
                    {req.customer?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date & Time:</span>{" "}
                    {req.requestedDate} at {req.requestedTime}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      statusColors[req.status] || "text-gray-700"
                    }`}
                  >
                    Status: {req.status}
                  </p>
                </div>

                {/* ✔️ Action Buttons (Only if Pending) */}
                {req.status === "pending" && (
                  <div className="flex mt-4 md:mt-0 gap-3">
                    <button
                      onClick={() => updateStatus(req._id, "accepted")}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(req._id, "rejected")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No service requests in this category.</p>
          )}
        </div>
      </div>
    </>
  );
}
