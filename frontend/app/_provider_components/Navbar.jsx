"use client";
import React from "react";
import { FaBars } from "react-icons/fa";
import { GrClose } from "react-icons/gr";

function Navbar() {
  return (
    <div 
      className="w-screen flex text-white py-3 md:px-8 justify-between items-center z-10 ml-[-80px]"
      style={{ background: "#3c8dbc" }}
    >
      {/* Left Side (Logo & Title) */}
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-2xl">Provider Dashboard</h1>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center bg-white text-teal-500 font-semibold px-2 py-1">
        <button>
          <FaBars className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
