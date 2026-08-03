"use client";

import { useEffect, useState } from "react";
import { deleteRoom, fetchRooms, updateRoom } from "@/services/room.service";

const defaultForm = {
  title: "",
  type: "",
  price: "",
  capacity: "",
  status: "available",
};

export default function RoomManagementTable() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    try {
      const data = await fetchRooms();
      setRooms(Array.isArray(data) ? data : []);
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
        const data = await fetchRooms();
        if (active) {
          setRooms(Array.isArray(data) ? data : []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRoom(editingId, form);
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/rooms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setForm(defaultForm);
      setEditingId(null);
      loadRooms();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRoom(id);
      loadRooms();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
            placeholder="Room title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
            placeholder="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
          />
          <input
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
            placeholder="Capacity"
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            required
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <select
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
            {editingId ? "Update room" : "Add room"}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        <table className="min-w-full text-sm text-slate-200">
          <thead className="bg-slate-800 text-left">
            <tr>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan="6">Loading rooms...</td></tr>
            ) : rooms.length === 0 ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan="6">No rooms available.</td></tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="border-t border-slate-800">
                  <td className="px-4 py-3">{room.title || room.name}</td>
                  <td className="px-4 py-3">{room.type}</td>
                  <td className="px-4 py-3">${room.price}</td>
                  <td className="px-4 py-3">{room.capacity}</td>
                  <td className="px-4 py-3">{room.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(room.id);
                          setForm({
                            title: room.title || room.name,
                            type: room.type,
                            price: room.price,
                            capacity: room.capacity,
                            status: room.status,
                          });
                        }}
                        className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
