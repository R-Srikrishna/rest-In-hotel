"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchRoomById } from "@/services/room.service";
import { createBooking } from "@/services/booking.service";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (roomId) {
      loadRoomDetails();
    }
  }, [roomId]);

  const loadRoomDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const roomData = await fetchRoomById(roomId);
      setRoom(roomData);
    } catch (err) {
      console.error("Failed to load room:", err);
      setError("Failed to fetch room details.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const days = calculateDays();
  const totalPrice = days * (room?.price || 0);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (days <= 0) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createBooking({
        roomId: room.id || room._id,
        checkInDate,
        checkOutDate,
        totalPrice,
      });

      // Show confirmation modal
      setShowModal(true);

      // Redirect after 2 seconds to my-bookings page
      setTimeout(() => {
        router.push("/my-bookings");
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to complete booking. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-300 font-medium">
        Loading room details...
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="py-12 text-center text-red-400 font-medium">{error}</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-white">
      <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {room?.title || `Room ${room?.roomNumber || ""}`}
          </h1>
          <p className="text-sm text-slate-400 capitalize">
            {room?.roomType || "Standard"} Room
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-400">₹{room?.price}</p>
          <p className="text-xs text-slate-400">per night</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Check-In Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Check-Out Date
            </label>
            <input
              type="date"
              min={checkInDate || todayStr}
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Calculation Summary */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>Duration:</span>
            <span className="font-semibold text-white">
              {days > 0 ? `${days} Night(s)` : "--"}
            </span>
          </div>
          <div className="flex justify-between text-sm text-slate-300">
            <span>Rate:</span>
            <span>₹{room?.price || 0} / night</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-emerald-400 border-t border-slate-700 pt-2">
            <span>Total Price:</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || days <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Booking..." : "Confirm & Book"}
        </button>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">
              Booked Successfully!
            </h3>
            <p className="text-sm text-slate-300">
              Your reservation has been saved to the database.
            </p>
            <p className="text-xs text-slate-500">
              Redirecting to My Bookings...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
