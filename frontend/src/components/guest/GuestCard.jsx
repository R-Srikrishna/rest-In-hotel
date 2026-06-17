"use client";

import { FiUser, FiMail, FiPhone, FiGlobe, FiHash } from "react-icons/fi";

export default function GuestCard({ guest }) {
  // If data hasn't arrived yet, show a clean state
  if (!guest) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed">
        No guest data available.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto">
      {/* Header Profile Section */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
          {guest.firstName?.charAt(0).toUpperCase() || <FiUser />}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {guest.firstName} {guest.lastName}
          </h1>
          <p className="text-sm text-gray-500">Guest Profile Details</p>
        </div>
      </div>

      {/* Info Grid Rows */}
      <div className="space-y-4">
        {/* System ID row */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <FiHash className="text-gray-400 text-lg flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Guest ID
            </p>
            <p className="text-sm font-mono text-gray-700">{guest.id}</p>
          </div>
        </div>

        {/* Email Address row */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <FiMail className="text-gray-400 text-lg flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Email Address
            </p>
            <p className="text-sm text-gray-700">{guest.email}</p>
          </div>
        </div>

        {/* Phone Number row */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <FiPhone className="text-gray-400 text-lg flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Phone Number
            </p>
            <p className="text-sm text-gray-700">
              {guest.phoneNumber || "N/A"}
            </p>
          </div>
        </div>

        {/* Country/Location row */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <FiGlobe className="text-gray-400 text-lg flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Country / Origin
            </p>
            <p className="text-sm text-gray-700">{guest.country || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
