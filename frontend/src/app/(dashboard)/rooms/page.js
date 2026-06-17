"use client";

import React, { useState, useEffect } from "react";
import RoomTable from "../../../components/room/RoomTable";
import { fetchRooms, deleteRoom } from "../../../services/room.service";
import { useRouter } from "next/navigation";

export default function RoomsDirectoryRootPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const syncDatabaseView = async () => {
    try {
      const data = await fetchRooms();
      setRooms(Array.isArray(data) ? data : data?.rooms || []);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncDatabaseView();
  }, []);

  const handleUpdateNavigation = (room) => {
    router.push(`/rooms/${room.id}`);
  };

  const handleDeletionSequence = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this room asset from inventory?",
      )
    )
      return;
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      alert("Deletion error. Administrative privileges required.");
    }
  };

  if (loading)
    return (
      <div className="m-10 text-gray-400 font-medium animate-pulse text-center">
        Loading Asset Directories...
      </div>
    );

  return (
    <div className="m-10">
      <RoomTable
        rooms={rooms}
        onUpdateRoom={handleUpdateNavigation}
        onDeleteRoom={handleDeletionSequence}
      />
    </div>
  );
}
