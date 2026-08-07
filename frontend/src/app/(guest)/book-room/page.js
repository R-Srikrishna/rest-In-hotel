"use client";

import { useEffect, useState } from "react";
import { fetchRooms } from "@/services/room.service";
import RoomCard from "@/components/guest/RoomCard";

export default function GuestBookRoomPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchRooms();
        const roomList = Array.isArray(data) ? data : [];
        setRooms(roomList);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        setError("Could not load available rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Book a Room</h1>
        <p className="text-sm text-slate-400">
          Select a room from our available inventory to get started.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 font-medium">
          Loading rooms...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-950/80 text-red-300 rounded-xl border border-red-800 text-sm">
          {error}
        </div>
      ) : rooms.length === 0 ? (
        <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
          No available rooms found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id || room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
