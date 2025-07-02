"use client";  // Client-side directive

import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { metadata } from './_metadata/metaData';  // Import metadata from the server component

const inter = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // List of routes where the header is not shown
  const noHeaderRoutes = ['/dashboard', "/bookings", "/servicerequests", "/earnings", "/manageservices", "/messages"];
  const showHeader = !noHeaderRoutes.includes(pathname);

  // Admin-specific routes
  const adminRoutes = ["/admin/dashboard", "/admin/bookings", "/admin/customers", "/admin/services", "/admin/providers"];

  // User and Admin role checking from localStorage
  const isAuthenticated = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"))?.role === "provider"; 
  const isUser = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"))?.role === "customer";
  const isAdmin = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"))?.role === "admin";

  // If user is not authenticated for admin routes, redirect to login
  if (adminRoutes.includes(pathname) && !isAdmin) {
    router.push("/login");  // Redirect to login page if not an admin
    return null;  // Return null while the redirect is happening
  }

  // If the route is in noHeaderRoutes and the user is not authenticated, redirect to login
  if ((!isAuthenticated && noHeaderRoutes.includes(pathname)) || (!isUser && pathname.startsWith("/my"))) {
    router.push("/login");  // Redirect to login page
    return null;  // Return null while the redirect is happening
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="mx-6 md:mx-16">
          {/* If not an admin route, show the header */}
          {showHeader && !adminRoutes.includes(pathname) && <Header />}
          <Toaster />
          {children}
        </div>
      </body>
    </html>
  );
}
