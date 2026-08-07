"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchRoomById } from "@/services/room.service";
import { createBooking } from "@/services/booking.service";

export default function RoomBookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    checkInDate: "",
    checkOutDate: "",
  });

  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (roomId) {
      loadRoom();
    }
  }, [roomId]);

  useEffect(() => {
    calculateSummary();
  }, [form.checkInDate, form.checkOutDate, room]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      const res = await fetchRoomById(roomId);
      const roomData = res?.data?.room ?? res?.room ?? res;
      setRoom(roomData);
    } catch (err) {
      console.error("Error fetching room details:", err);
      setErrorMessage("Could not retrieve details for this room.");
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    if (!room || !form.checkInDate || !form.checkOutDate) {
      setTotalDays(0);
      setTotalPrice(0);
      return;
    }

    const start = new Date(form.checkInDate);
    const end = new Date(form.checkOutDate);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      setTotalDays(diffDays);
      setTotalPrice(diffDays * Number(room.price || 0));
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (totalDays <= 0) {
      setErrorMessage("Check-out date must be after check-in date.");
      return;
    }

    try {
      setSubmitting(true);
      await createBooking({
        roomId: room.id || room._id,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        totalPrice,
      });

      // Trigger the success modal overlay
      setShowSuccessModal(true);

      // Navigate directly to my-bookings page after 2 seconds
      setTimeout(() => {
        router.push("/my-bookings");
      }, 2000);
    } catch (err) {
      console.error("Booking submission error:", err);
      setErrorMessage(
        err?.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-medium text-slate-300">
        Loading room details...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="py-20 text-center text-red-400 font-medium">
        {errorMessage || "Room details not found."}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 my-8">
      {/* Room Overview Header */}
      <div className="border-b border-slate-800 pb-5 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">
            {room.title || `Room ${room.roomNumber || ""}`}
          </h1>
          <p className="text-sm text-slate-400 capitalize">
            {room.roomType || "Standard"} Room
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-400">₹{room.price}</p>
          <p className="text-xs text-slate-400">per night</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-950/80 text-red-300 rounded-xl border border-red-800 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-300">
              Check-in Date
            </label>
            <input
              type="date"
              name="checkInDate"
              min={todayStr}
              value={form.checkInDate}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-300">
              Check-out Date
            </label>
            <input
              type="date"
              name="checkOutDate"
              min={form.checkInDate || todayStr}
              value={form.checkOutDate}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Dynamic Calculation Summary */}
        <div className="border-t border-slate-800 pt-5 space-y-3 bg-slate-800/40 p-4 rounded-xl">
          <div className="flex justify-between text-sm text-slate-300">
            <span>Total Stay Duration:</span>
            <span className="font-semibold text-white">
              {totalDays > 0 ? `${totalDays} night(s)` : "--"}
            </span>
          </div>

          <div className="flex justify-between text-sm text-slate-300">
            <span>Rate per Night:</span>
            <span className="text-white">₹{room.price}</span>
          </div>

          <div className="flex justify-between font-bold text-lg text-emerald-400 border-t border-slate-700/60 pt-3">
            <span>Total Price:</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || totalDays <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? "Processing..." : "Confirm & Book Now"}
        </button>
      </form>

      {/* Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-white">
              Booked Successfully!
            </h3>
            <p className="text-sm text-slate-300">
              Your room reservation has been created and saved to the database.
            </p>
            <div className="text-xs text-slate-500 pt-2">
              Redirecting to your bookings list...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
