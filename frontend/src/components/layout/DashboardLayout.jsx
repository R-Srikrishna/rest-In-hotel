"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
// Define the routes that only admins should access
const ADMIN_ONLY_ROUTES = ["/admin", "/admin/rooms", "/admin/bookings", "/admin/guests"];

export default function ProtectedLayout({ children }) {
  // Pulling 'user' along with isAuthenticated to check roles
  const { isAuthenticated, loading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login";

  useEffect(() => {
    // 1. Kick unauthenticated users to the login page
    if (!loading && !isAuthenticated && !isAuthPage) {
      router.push("/login");
      return;
    }

    // 2. Security Check: If they are authenticated but not an admin, block admin routes
    if (!loading && isAuthenticated && !isAuthPage) {
      const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));
      if (isAdminRoute && user?.role !== "admin") {
        router.replace("/book-room");
      }
    }
  }, [loading, isAuthenticated, isAuthPage, pathname, user, router]);

  // Add this visual spinner check before your main return statement
  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        {/* Animated Circular Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Prevent rendering admin pages content momentarily while redirecting non-admins
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isAuthenticated && isAdminRoute && user?.role !== "admin") {
    return null;
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen w-full top-0 bg-gray-50">
        {/* Top Header */}
        <Header />

        {/* The Core Fix: Row alignment for Sidebar + Content */}
        <div className="flex flex-1 relative w-full">
          {/* Sidebar sits nicely inside here */}
          <Sidebar />

          {/* Main content expands. pl-16 ensures the content sits past your fixed sidebar button */}
          <main className="flex-grow min-w-0 p-4 pt-20 md:p-6 md:pl-6 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Bottom Footer stays pinned to bottom naturally via flex-col wrapper */}
        <Footer />
      </div>
    );
  }

  return null;
}
