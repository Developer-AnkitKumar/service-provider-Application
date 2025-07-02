"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import img from "../default_user_logo.png";
import logo from "../logo_work_force_network.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

function Header() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src={logo}
              alt="Work Force Network" 
              width={48}
              height={48}
              className="h-12 w-auto transition-transform group-hover:scale-105"
              priority
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent hidden sm:block">
              Work Force Network
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="relative text-gray-600 hover:text-primary font-medium transition-colors group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/services" 
              className="relative text-gray-600 hover:text-primary font-medium transition-colors group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="relative text-gray-600 hover:text-primary font-medium transition-colors group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none group relative">
                  <Image 
                    src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : img} 
                    alt="Profile" 
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 hover:border-primary transition-all group-hover:ring-2 group-hover:ring-primary/20"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full w-3 h-3"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 mt-2 shadow-xl rounded-lg bg-white border border-gray-100 overflow-hidden"
                align="end"
              >
                <DropdownMenuLabel className="font-medium text-gray-900 px-4 py-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Image 
                      src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : img} 
                      alt="Profile" 
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-semibold">{user.name || "Welcome"}</p>
                      <p className="text-xs text-gray-500">{user.role === "customer" ? "Customer" : "Service Provider"}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />

                {user.role === "customer" ? (
                  <>
                    <DropdownMenuItem className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                      <Link href="/mybookings" className="w-full flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h1a1 1 0 100-2h-1z" clipRule="evenodd" />
                        </svg>
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                      <Link href="/mymessages" className="w-full flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Messages
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : user.role === "provider" ? (
                  <DropdownMenuItem className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Link href="/dashboard" className="w-full flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : null}

                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem 
                  className="px-4 py-2.5 text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="hidden sm:flex items-center gap-2 border-primary text-primary hover:bg-primary/5 hover:text-primary/90 transition-colors"
                onClick={() => window.location.href = "/login"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Login
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2"
                onClick={() => window.location.href = "/signup"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                </svg>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;