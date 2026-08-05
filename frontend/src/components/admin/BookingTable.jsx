"use client";

import { useEffect, useState } from "react";
import { deleteBooking, fetchAdminBookings, updateBooking } from "@/services/booking.service";

export default function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const data = await fetchAdminBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const runLoad = async () => {
      try {
        const data = await fetchAdminBookings();
        if (active) {
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void runLoad();

    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateBooking(id, { status });
      loadBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      loadBookings();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
      <table className="min-w-full text-sm text-slate-200">
        <thead className="bg-slate-800 text-left">
          <tr>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Room</th>
            <th className="px-4 py-3">Check-in</th>
            <th className="px-4 py-3">Check-out</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="px-4 py-6 text-slate-400" colSpan="6">Loading bookings...</td></tr>
          ) : bookings.length === 0 ? (
            <tr><td className="px-4 py-6 text-slate-400" colSpan="6">No bookings found.</td></tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-slate-800">
                <td className="px-4 py-3">{booking.guest?.firstName || booking.guestName || "Guest"}</td>
                <td className="px-4 py-3">{booking.room?.title || booking.roomName || "Room"}</td>
                <td className="px-4 py-3">{booking.checkInDate || booking.startDate}</td>
                <td className="px-4 py-3">{booking.checkOutDate || booking.endDate}</td>
                <td className="px-4 py-3">
                  <select
                    value={booking.status || "pending"}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked-in">Checked in</option>
                    <option value="checked-out">Checked out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
