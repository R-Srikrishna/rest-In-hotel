"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function GuestTable() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for tracking which guest is being edited
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    let active = true;

    const loadGuests = async () => {
      try {
        const response = await api.get("/guests");
        if (active) {
          setGuests(response.data?.data?.guests || []);
        }
      } catch (error) {
        console.error("Failed to load guests:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadGuests();

    return () => {
      active = false;
    };
  }, []);

  // Enter edit mode and populate form fields
  const handleEditClick = (guest) => {
    setEditingId(guest.id);
    setEditForm(guest);
  };

  // Handle text input changes for the editing form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated guest data to backend
  const handleSave = async (id) => {
    try {
      await api.put(`/guests/${id}`, editForm);

      // Update local state smoothly
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...editForm } : g)),
      );
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update guest:", error);
      alert("Error saving updates. Please try again.");
    }
  };

  // Delete guest record from backend and local state
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;

    try {
      await api.delete(`/guests/${id}`);

      // Filter out deleted guest instantly
      setGuests((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Failed to delete guest:", error);
      alert("Error deleting guest. Please try again.");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
      <table className="min-w-full text-sm text-slate-200">
        <thead className="bg-slate-800 text-left">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="px-4 py-6 text-slate-400 text-center" colSpan={5}>
                Loading guests...
              </td>
            </tr>
          ) : guests.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-slate-400 text-center" colSpan={5}>
                No guests found.
              </td>
            </tr>
          ) : (
            guests.map((guest) => {
              const isEditing = editingId === guest.id;

              return (
                <tr
                  key={guest.id}
                  className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                >
                  {isEditing ? (
                    <>
                      {/* Edit Fields Mode */}
                      <td className="px-4 py-2 flex gap-1">
                        <input
                          type="text"
                          name="firstName"
                          value={editForm.firstName || ""}
                          onChange={handleInputChange}
                          className="w-1/2 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={editForm.lastName || ""}
                          onChange={handleInputChange}
                          className="w-1/2 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="email"
                          name="email"
                          value={editForm.email || ""}
                          onChange={handleInputChange}
                          className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="phoneNumber"
                          value={editForm.phoneNumber || ""}
                          onChange={handleInputChange}
                          className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">{guest.status || "Active"}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          onClick={() => handleSave(guest.id)}
                          className="text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-slate-400 hover:text-slate-300"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Read Only Mode */}
                      <td className="px-4 py-3">
                        {guest.firstName} {guest.lastName}
                      </td>
                      <td className="px-4 py-3">{guest.email}</td>
                      <td className="px-4 py-3">{guest.phoneNumber}</td>
                      <td className="px-4 py-3">{guest.status || "Active"}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button
                          onClick={() => handleEditClick(guest)}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="text-rose-400 hover:text-rose-300 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
