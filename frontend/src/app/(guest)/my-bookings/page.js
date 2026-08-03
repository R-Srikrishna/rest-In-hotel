"use client";

import { useEffect, useState } from "react";
import { fetchBookings } from "@/services/booking.service";

export default function GuestBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">My bookings</h1>
        <p className="text-sm text-slate-400">Track the reservations you have made.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        <table className="min-w-full text-sm text-slate-200">
          <thead className="bg-slate-800 text-left">
            <tr>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Check-in</th>
              <th className="px-4 py-3">Check-out</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan="4">Loading bookings...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan="4">No bookings yet.</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-800">
                  <td className="px-4 py-3">{booking.room?.title || booking.roomName || "Room"}</td>
                  <td className="px-4 py-3">{booking.checkInDate || booking.startDate}</td>
                  <td className="px-4 py-3">{booking.checkOutDate || booking.endDate}</td>
                  <td className="px-4 py-3">{booking.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
