"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
  BedDouble,
  Plus,
  LayoutGrid,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

const RoomTable = ({ rooms = [], onUpdateRoom, onDeleteRoom }) => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.available).length;
  const processingRooms = rooms.filter((r) => !r.available).length;

  const filteredRooms = rooms.filter((room) => {
    const roomType = room.roomType || "Deluxe";
    const roomStatus = room.available ? "Available" : "Occupied";

    const matchesType =
      selectedType === "All" ||
      roomType.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus =
      selectedStatus === "All" ||
      roomStatus.toLowerCase() === selectedStatus.toLowerCase();

    return matchesType && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Rooms Directory
          </h1>
          <p className="text-sm text-gray-500">
            Monitor availability, types, and operational statuses
          </p>
        </div>
        <button
          onClick={() => router.push("/rooms/create")}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition self-start sm:self-auto"
        >
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <LayoutGrid size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Rooms</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalRooms}</h3>
          </div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Available Rooms</p>
            <h3 className="text-2xl font-bold text-green-600">
              {availableRooms}
            </h3>
          </div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <RefreshCw size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Under Processing
            </p>
            <h3 className="text-2xl font-bold text-amber-600">
              {processingRooms}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 border border-gray-200 rounded-xl">
        <span className="text-sm font-semibold text-gray-600">Filters:</span>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-sm bg-white font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="All">All Room Types</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Deluxe">Deluxe</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-sm bg-white font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available Only</option>
          <option value="Occupied">Under Processing / Occupied</option>
        </select>
        {(selectedType !== "All" || selectedStatus !== "All") && (
          <button
            onClick={() => {
              setSelectedType("All");
              setSelectedStatus("All");
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Room Info</th>
              <th className="px-6 py-4">Room Type</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => {
                const currentStatus = room.available ? "Available" : "Occupied";
                return (
                  <tr key={room.id} className="hover:bg-blue-50/30 transition">
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                      #{room.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                          <BedDouble className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-gray-900">
                          Room {room.roomNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {room.roomType || "Deluxe"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ${Number(room.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${currentStatus === "Available" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => onUpdateRoom(room)}
                          className="p-1.5 border rounded bg-white text-gray-500 hover:text-green-600 hover:bg-green-50"
                          title="Edit Properties"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteRoom(room.id)}
                          className="p-1.5 border rounded bg-white text-gray-500 hover:text-red-600 hover:bg-red-50"
                          title="Delete Unit"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-400 font-medium"
                >
                  No matching properties located.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTable;
