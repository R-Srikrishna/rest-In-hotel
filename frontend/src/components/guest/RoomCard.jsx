"use client";

import { useRouter } from "next/navigation";

export default function RoomCard({ room }) {
  const router = useRouter();

  if (!room) return null;

  const handleBookClick = () => {
    const roomId = room.id || room._id;
    router.push(`/book-room/${roomId}`);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg flex flex-col justify-between p-5 text-white">
      <div>
        <div className="h-44 w-full bg-slate-800 rounded-xl mb-4 flex items-center justify-center text-slate-500 font-medium">
          {room.image ? (
            <img
              src={room.image}
              alt={`Room ${room.roomNumber}`}
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            `Room ${room.roomNumber || ""}`
          )}
        </div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold">
            Room {room.roomNumber || "Detail"}
          </h2>
          <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 capitalize">
            {room.roomType || "Standard"}
          </span>
        </div>
        <p className="text-2xl font-bold text-blue-400 mb-4">
          ₹{room.price}{" "}
          <span className="text-xs text-slate-400 font-normal">/ night</span>
        </p>
      </div>

      <button
        onClick={handleBookClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition cursor-pointer"
      >
        Book Now
      </button>
    </div>
  );
}
