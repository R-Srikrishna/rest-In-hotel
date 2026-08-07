"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { fetchRoomById } from "@/services/room.service";
import { createBooking } from "@/services/booking.service";

export default function BookingForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params?.id;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    checkInDate: searchParams.get("checkIn") || "",
    checkOutDate: searchParams.get("checkOut") || "",
  });

  const [days, setDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (roomId) {
      loadRoom();
    }
  }, [roomId]);

  useEffect(() => {
    calculateTotal();
  }, [form.checkInDate, form.checkOutDate, room]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      const roomData = await fetchRoomById(roomId);
      
      // Handle MongoDB _id or standard id
      const resolvedRoom = roomData?.data?.room || roomData?.room || roomData;
      
      if (!resolvedRoom || (!resolvedRoom.id && !resolvedRoom._id)) {
        throw new Error("Invalid room payload received");
      }

      setRoom(resolvedRoom);
    } catch (err) {
      console.error("Error loading room:", err);
      setMessage({ type: "error", text: "Unable to load room details." });
    } fontinally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!room || !form.checkInDate || !form.checkOutDate) {
      setDays(0);
      setTotalPrice(0);
      return;
    }

    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      setDays(0);
      setTotalPrice(0);
      return;
    }

    setDays(diffDays);
    setTotalPrice(diffDays * Number(room.price || 0));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (days <= 0) {
      return setMessage({
        type: "error",
        text: "Check-out date must be after check-in date.",
      });
    }

    try {
      setSubmitting(true);
      await createBooking({
        roomId: room._id || room.id,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        nightlyRate: Number(room.price),
        totalPrice,
      });

      setMessage({
        type: "success",
        text: "Booking created successfully! Navigating to your bookings...",
      });

      setTimeout(() => {
        router.push("/guest/bookings");
      }, 1000);
    } catch (err) {
      console.error("Booking error:", err);
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Booking failed. Please try again.",
      });
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
        Room not found or unavailable.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 my-10">
      <h2 className="text-2xl font-bold mb-2">
        Book {room.title || room.name || `Room ${room.roomNumber || ""}`}
      </h2>
      <p className="text-slate-400 mb-6">
        Price per night:{" "}
        <span className="font-semibold text-emerald-400">₹{room.price}</span>
      </p>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.type === "error"
              ? "bg-red-950 text-red-300 border border-red-800"
              : "bg-emerald-950 text-emerald-300 border border-emerald-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">
            Check-in Date
          </label>
          <input
            type="date"
            name="checkInDate"
            min={todayStr}
            value={form.checkInDate}
            onChange={handleChange}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">
            Check-out Date
          </label>
          <input
            type="date"
            name="checkOutDate"
            min={form.checkInDate || todayStr}
            value={form.checkOutDate}
            onChange={handleChange}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {days > 0 && (
          <div className="border-t border-slate-800 pt-4 mt-4 space-y-2 bg-slate-800/50 p-4 rounded-lg">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Total nights:</span>
              <span className="font-medium text-white">{days}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>Rate per night:</span>
              <span className="text-white">₹{room.price}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-emerald-400 border-t border-slate-700 pt-2">
              <span>Total Price:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || days <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Processing Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}