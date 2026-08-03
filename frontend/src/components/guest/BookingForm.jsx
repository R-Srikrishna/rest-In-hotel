"use client";

import { useEffect, useState } from "react";
import { createBooking } from "@/services/booking.service";
import { fetchRooms } from "@/services/room.service";

export default function BookingForm() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomId: "", checkInDate: "", checkOutDate: "", status: "pending" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };

    loadRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await createBooking(form);
      setMessage("Booking request created successfully.");
      setForm({ roomId: "", checkInDate: "", checkOutDate: "", status: "pending" });
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to create booking right now.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200">
      <h2 className="text-xl font-semibold text-white">Book a room</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
          value={form.roomId}
          onChange={(e) => setForm({ ...form, roomId: e.target.value })}
          required
        >
          <option value="">Select a room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.title || room.name} - ${room.price}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
          value={form.checkInDate}
          onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
          required
        />

        <input
          type="date"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
          value={form.checkOutDate}
          onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
          required
        />

        <button className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white" type="submit">
          Create booking
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-slate-400">{message}</p> : null}
    </div>
  );
}
