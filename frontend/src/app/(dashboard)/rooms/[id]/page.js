"use client";

import React, { useState, useEffect } from "react";
import {
  fetchRoomById,
  updateRoom,
  deleteRoom,
} from "../../../../services/room.service";
import { useRouter, useParams } from "next/navigation";
import RoomForm from "@/components/room/RoomForm";

export default function RoomUpdateFormPage() {
  const router = useRouter();
  const { id } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;

        const data = await fetchRoomById(id);
        setRoomData(data);
      } catch (error) {
        console.error("Fetch failure:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleFormSave = async (formData) => {
    try {
      await updateRoom(id, formData);
      router.push("/rooms");
      router.refresh();
    } catch (error) {
      alert("Save operation rejected.");
    }
  };

  const handlePermanentDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to completely erase this layout structure?",
      )
    )
      return;
    try {
      await deleteRoom(id);
      router.push("/rooms");
      router.refresh();
    } catch (error) {
      alert("Delete operation rejected.");
    }
  };

  if (loading)
    return (
      <div className="m-10 text-center text-gray-500 animate-pulse">
        Syncing Form Components...
      </div>
    );
  if (!roomData)
    return (
      <div className="m-10 text-center text-red-500">
        Target property not found.
      </div>
    );

  return (
    <div className="m-10 max-w-xl mx-auto space-y-4">
      <button
        onClick={() => router.push("/rooms")}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        ← Discard and Go Back
      </button>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
        <button
          onClick={handlePermanentDelete}
          className="absolute top-6 right-6 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 transition"
        >
          Delete Layout
        </button>
        <RoomForm
          initialData={roomData}
          onSubmit={handleFormSave}
          onCancel={() => router.push("/rooms")}
        />
      </div>
    </div>
  );
}
