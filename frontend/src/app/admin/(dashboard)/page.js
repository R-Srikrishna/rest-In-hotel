"use client";

import { useEffect, useState } from "react";
import { fetchRooms } from "@/services/room.service";
import { fetchBookings } from "@/services/booking.service";
import api from "@/lib/axios";

const cards = [
  { label: "Total rooms", key: "rooms" },
  { label: "Total bookings", key: "bookings" },
  { label: "Total guests", key: "guests" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ rooms: 0, bookings: 0, guests: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [rooms, bookings, guestsResponse] = await Promise.all([
          fetchRooms(),
          fetchBookings(),
          api.get("/guests"),
        ]);

        setStats({
          rooms: Array.isArray(rooms) ? rooms.length : 0,
          bookings: Array.isArray(bookings) ? bookings.length : 0,
          guests: guestsResponse.data?.data?.guests?.length || 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.key} className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stats[card.key]}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">Hotel overview</h2>
        <p className="mt-2 text-sm text-slate-400">
          Monitor rooms, reservations, and guest activity from one dashboard.
        </p>
      </div>
    </div>
  );
}
