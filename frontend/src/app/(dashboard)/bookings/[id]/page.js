"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings/rooms");
        const data = await res.json();

        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h2>Loading bookings...</h2>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Room</th>
            <th className="border p-3 text-left">Guest</th>
            <th className="border p-3 text-left">Check-In</th>
            <th className="border p-3 text-left">Check-Out</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border p-3">
                  {booking.roomNumber || booking.room?.number}
                </td>

                <td className="border p-3">
                  {booking.guestName || booking.guest?.name}
                </td>

                <td className="border p-3">{booking.checkIn}</td>

                <td className="border p-3">{booking.checkOut}</td>

                <td className="border p-3">
                  <button
                    onClick={() => router.push(`/bookings/rooms/${booking.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border p-3 text-center">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
