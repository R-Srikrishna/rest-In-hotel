"use client";

import React from "react";
import RoomForm from "../../../../components/room/RoomForm";
import { useRouter } from "next/navigation";
import { createRoom } from "../../../../services/room.service";

export default function CreateRoomPage() {
  const router = useRouter();

  const handleCreationFormSubmit = async (data) => {
    try {
      const sanitizedData = {
        ...data,
        roomNumber: data.roomNumber ? Number(data.roomNumber) : undefined,
        price: data.price ? parseFloat(data.price) : undefined,
      };

      await createRoom(sanitizedData);
      router.push("/rooms");
      router.refresh();
    } catch (error) {
      alert("Failed to register room asset.");
    }
  };

  return (
    <div className="m-10 max-w-xl mx-auto space-y-4">
      <button
        onClick={() => router.push("/rooms")}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        ← Abort and Return
      </button>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <RoomForm
          onSubmit={handleCreationFormSubmit}
          onCancel={() => router.push("/rooms")}
        />
      </div>
    </div>
  );
}
