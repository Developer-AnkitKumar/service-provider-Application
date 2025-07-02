"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const provider = JSON.parse(localStorage.getItem("user")); // Fetch provider data

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
    router.refresh();
  };

  // Sidebar Menu Items
  const sideLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bookings", path: "/bookings" },
    { name: "Service Requests", path: "/servicerequests" },
    { name: "Earnings", path: "/earnings" },
    { name: "Manage Services", path: "/manageservices" },
    { name: "Messages", path: "/messages" }, // New Messages/Chat section
  ];

  return (
    <div
      className={`h-[92vh] w-64 flex flex-col gap-6 items-center py-10 px-6 absolute left-0 top-0 bg-gray-800 text-white mt-[55px]`}
    >
      <h2 className="font-bold text-lg mb-8">Home Service Dashboard</h2>

      {/* Sidebar Links */}
      {sideLinks.map((item, index) => (
        <Link key={index} href={item.path}>
          <div
            className="hover:bg-gray-700 w-full text-left py-3 px-5 cursor-pointer rounded-md"
          >
            {item.name}
          </div>
        </Link>
      ))}

      {/* Logout Button */}
      <button
        className="mt-auto bg-red-500 w-full py-3 text-white font-medium rounded-md hover:bg-red-600"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
