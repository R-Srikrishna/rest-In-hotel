"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const Header = () => {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6">
      {/* Left: brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[15px] font-medium tracking-tight text-neutral-900 dark:text-white">
            Hotel Manager
          </span>
        </div>
      </div>

      {/* Right: avatar + logout */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[12px] font-medium text-blue-600 dark:text-blue-300">
          {initials}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 h-8 px-3.5 text-[13px] font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
