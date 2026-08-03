"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  Calendar,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-5 z-40 border-r flex items-center justify-center">
        <p className="text-gray-400 text-sm font-medium animate-pulse">
          Loading menu...{" "}
        </p>
      </aside>
    );
  }

  const menuItems =
    user?.role === "admin"
      ? [
          {
            name: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
          },
          {
            name: "Rooms",
            href: "/admin/rooms",
            icon: DoorOpen,
          },
          {
            name: "Guests",
            href: "/admin/guests",
            icon: Users,
          },
          {
            name: "Bookings",
            href: "/admin/bookings",
            icon: Calendar,
          },
        ]
      : [
          {
            name: "Dashboard",
            href: "/",
            icon: LayoutDashboard,
          },
          {
            name: "Book room",
            href: "/book-room",
            icon: DoorOpen,
          },
          {
            name: "My bookings",
            href: "/my-bookings",
            icon: Calendar,
          },
        ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar Menu"
        className="fixed top-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-xl border-r flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b mt-16">
          <h2 className="text-xl font-bold text-gray-800">
            Hotel Control Panel
          </h2>

          {user ? (
            <p className="text-xs font-semibold text-blue-600 tracking-wide mt-1 uppercase bg-blue-50 px-2 py-1 rounded inline-block">
              {user.firstName || "User"} — {user.role}
            </p>
          ) : (
            <p className="text-xs text-red-500 font-medium mt-1">
              No Active Session
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="border-t p-4">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
