"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  Calendar,
  IndianRupee,
} from "lucide-react";

export default function BookingTable({
  bookings = [],
  onUpdateBooking,
  onDeleteBooking,
}) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase().trim();

    const bookingId = String(booking.id || "").toLowerCase();

    const guestName = String(
      booking.guestName ||
        (booking.guest?.firstName
          ? `${booking.guest.firstName} ${booking.guest.lastName || ""}`
          : ""),
    ).toLowerCase();

    const roomNumber = String(
      booking.roomNumber || booking.room?.roomNumber || "",
    ).toLowerCase();

    const matchesSearch =
      !query ||
      bookingId.includes(query) ||
      guestName.includes(query) ||
      roomNumber.includes(query);

    let matchesDate = true;

    if (dateFilter !== "All") {
      const checkInDate = new Date(booking.checkIn || booking.checkInDate);

      const today = new Date();

      const diffDays = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));

      if (dateFilter === "Today") {
        matchesDate = checkInDate.toDateString() === today.toDateString();
      } else if (dateFilter === "This Week") {
        matchesDate = diffDays >= 0 && diffDays <= 7;
      } else if (dateFilter === "This Month") {
        matchesDate =
          checkInDate.getMonth() === today.getMonth() &&
          checkInDate.getFullYear() === today.getFullYear();
      }
    }

    const price = Number(
      booking.price || booking.totalAmount || booking.room?.price || 0,
    );

    let matchesPrice = true;

    if (priceFilter === "Below 5000") {
      matchesPrice = price < 5000;
    } else if (priceFilter === "5000-10000") {
      matchesPrice = price >= 5000 && price <= 10000;
    } else if (priceFilter === "Above 10000") {
      matchesPrice = price > 10000;
    }

    return matchesSearch && matchesDate && matchesPrice;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Bookings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all guest bookings and scheduling operations
          </p>
        </div>

        <button
          onClick={() => router.push("/bookings/new")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors duration-150 self-start sm:self-auto"
        >
          <Plus size={18} />
          Add Booking
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </div>

            <input
              type="text"
              placeholder="Search by ID, Guest Name, or Room Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Date Filter */}
          <div className="relative min-w-[180px]">
            <Calendar
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="relative min-w-[200px]">
            <IndianRupee
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="All">All Prices</option>
              <option value="Below 5000">Below ₹5,000</option>
              <option value="5000-10000">₹5,000 - ₹10,000</option>
              <option value="Above 10000">Above ₹10,000</option>
            </select>
          </div>

          {(searchQuery || dateFilter !== "All" || priceFilter !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setDateFilter("All");
                setPriceFilter("All");
              }}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-blue-50/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                      #{booking.id}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Room {booking.roomNumber || booking.room?.roomNumber}
                    </td>

                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {booking.guestName ||
                        (booking.guest
                          ? `${booking.guest.firstName} ${
                              booking.guest.lastName || ""
                            }`
                          : "Unknown Guest")}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {booking.checkIn || booking.checkInDate}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {booking.checkOut || booking.checkOutDate}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">
                        ₹
                        {booking.price ||
                          booking.totalAmount ||
                          booking.room?.price ||
                          0}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => router.push(`/bookings/${booking.id}`)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => {
                            if (onUpdateBooking) {
                              onUpdateBooking(booking);
                            } else {
                              router.push(`/bookings/edit/${booking.id}`);
                            }
                          }}
                          className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit Booking"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete booking #${booking.id}?`,
                              )
                            ) {
                              onDeleteBooking?.(booking.id);
                            }
                          }}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 italic font-medium"
                  >
                    {bookings.length === 0
                      ? "No bookings found in the database."
                      : "No records match your search criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
