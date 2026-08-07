"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  createRoom,
  deleteRoom,
  fetchRooms,
  updateRoom,
} from "@/services/room.service";

const defaultForm = {
  roomNumber: "",
  roomType: "",
  price: "",
  tv: false,
  fridge: false,
  washingMachine: false,
  heater: false,
  bathtub: false,
  internetAccess: false,
  coffeeTea: false,
  privatePool: false,
  airConditioning: false,
  fan: false,
  sofa: false,
  chairs: false,
  bed: true,
  available: true,
};

const features = [
  ["tv", "TV"],
  ["fridge", "Fridge"],
  ["washingMachine", "Washing Machine"],
  ["heater", "Heater"],
  ["bathtub", "Bathtub"],
  ["internetAccess", "Internet Access"],
  ["coffeeTea", "Coffee / Tea"],
  ["privatePool", "Private Pool"],
  ["airConditioning", "Air Conditioning"],
  ["fan", "Fan"],
  ["sofa", "Sofa"],
  ["chairs", "Chairs"],
  ["bed", "Bed"],
];

export default function RoomManagementTable() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRooms = async () => {
    try {
      const data = await fetchRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load rooms", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.roomNumber || !form.roomType || !form.price) return;

    setSubmitting(true);
    const payload = {
      ...form,
      roomNumber: Number(form.roomNumber),
      price: Number(form.price),
    };

    try {
      if (editingId) {
        await updateRoom(editingId, payload);
      } else {
        await createRoom(payload);
      }
      setForm(defaultForm);
      setEditingId(null);
      await loadRooms();
    } catch (err) {
      console.error("Operation failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const editRoom = (room) => {
    setEditingId(room.id);
    setForm({
      roomNumber: room.roomNumber ?? "",
      roomType: room.roomType ?? "",
      price: room.price ?? "",
      tv: !!room.tv,
      fridge: !!room.fridge,
      washingMachine: !!room.washingMachine,
      heater: !!room.heater,
      bathtub: !!room.bathtub,
      internetAccess: !!room.internetAccess,
      coffeeTea: !!room.coffeeTea,
      privatePool: !!room.privatePool,
      airConditioning: !!room.airConditioning,
      fan: !!room.fan,
      sofa: !!room.sofa,
      chairs: !!room.chairs,
      bed: !!room.bed,
      available: !!room.available,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id);
        await loadRooms();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6"
      >
        <h2 className="text-lg font-semibold text-neutral-900">
          {editingId ? "Modify Room Details" : "Register New Room"}
        </h2>

        {/* Text Fields */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-600">
              Room Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 101"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.roomNumber}
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-600">
              Room Type
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Deluxe Suite"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.roomType}
              onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-600">
              Price per Night
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 150"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
        </div>

        {/* Feature Checkboxes */}
        <div>
          <span className="text-xs font-medium text-neutral-600 block mb-3">
            Room Amenities & Status
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
            {features.map(([key, label]) => (
              <label
                key={key}
                className="flex items-center space-x-2 text-sm text-neutral-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300"
                  checked={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.checked })
                  }
                />
                <span>{label}</span>
              </label>
            ))}
            <label className="flex items-center space-x-2 text-sm font-medium text-emerald-700 cursor-pointer select-none pt-2 border-t sm:border-t-0 border-neutral-200">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300"
                checked={form.available}
                onChange={(e) =>
                  setForm({ ...form, available: e.target.checked })
                }
              />
              <span>Available for Booking</span>
            </label>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingId ? (
              <Save className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {editingId ? "Update Room" : "Add Room"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="px-6 py-3.5 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Room No
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-neutral-600 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-sm text-neutral-700">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-neutral-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
                    <span>Retrieving rooms...</span>
                  </div>
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-neutral-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr
                  key={room.id}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {room.roomNumber}
                  </td>
                  <td className="px-6 py-4">{room.roomType}</td>
                  <td className="px-6 py-4 font-mono">${room.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        room.available
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}
                    >
                      {room.available ? "Available" : "Occupied"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editRoom(room)}
                        title="Edit Room"
                        className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        title="Delete Room"
                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
