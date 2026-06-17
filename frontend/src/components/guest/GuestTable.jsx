"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, Users } from "lucide-react";

const GuestTable = ({ guests = [], handleUpdate, handleDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Guest Management
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              All registered guests
            </p>
          </div>
        </div>
        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          {guests.length} {guests.length === 1 ? "Guest" : "Guests"}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {guests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No guests found</p>
                    <p className="text-gray-400 text-xs">
                      Add a guest to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              guests.map((guest) => {
                const initials =
                  `${guest.firstName?.[0] ?? ""}${guest.lastName?.[0] ?? ""}`.toUpperCase();
                return (
                  <tr
                    key={guest.id}
                    className="hover:bg-blue-50/30 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                      #{guest.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {initials || "?"}
                        </div>
                        <span className="font-medium text-gray-900">
                          {guest.firstName} {guest.lastName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-500">{guest.email}</td>

                    <td className="px-6 py-4 text-gray-500">
                      {guest.phoneNumber || (
                        <span className="text-gray-300 text-xs italic">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {guest.country ? (
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                          {guest.country}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs italic">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={guest?.id ? `/guests/${guest.id}` : "#"}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                          title="View guest"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleUpdate?.(guest.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-150"
                          title="Edit guest"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete?.(guest.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
                          title="Delete guest"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestTable;
