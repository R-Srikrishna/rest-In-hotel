"use client";

import React from "react";

export default function RoomDetails({ room }) {
  if (!room)
    return (
      <p className="text-gray-500">
        No profile configuration parameters provided.
      </p>
    );

  const structuralAmenities = [
    { key: "tv", label: "Television (TV)" },
    { key: "fridge", label: "Refrigerator" },
    { key: "washingMachine", label: "Washing Machine" },
    { key: "heater", label: "Water Heater" },
    { key: "bathtub", label: "Bathtub" },
    { key: "internetAccess", label: "Wi-Fi access" },
    { key: "coffeeTea", label: "Coffee/Tea Maker" },
    { key: "privatePool", label: "Private Pool" },
    { key: "airConditioning", label: "Air Conditioning" },
    { key: "fan", label: "Ceiling Fan" },
    { key: "sofa", label: "Sofa Lounge" },
    { key: "chairs", label: "Comfort Chairs" },
    { key: "bed", label: "Bed Furnished" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Room Details Configuration
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Room Index Number:{" "}
            <span className="font-mono font-bold text-gray-700">
              {room.roomNumber}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-blue-600">
            ${Number(room.price).toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Per Night
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <p>
          <strong>Room Category:</strong> {room.roomType}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-0.5 text-xs font-bold rounded ${room.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {room.available ? "Available" : "Occupied / Maintenance"}
          </span>
        </p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">
          Included Amenities Checklist
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {structuralAmenities.map((item) => {
            const isSupported = !!room[item.key];
            return (
              <div
                key={item.key}
                className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${isSupported ? "bg-gray-50 text-gray-800 border-gray-200" : "bg-white text-gray-300 border-gray-100 line-through"}`}
              >
                <span
                  className={
                    isSupported ? "text-green-500 font-bold" : "text-gray-300"
                  }
                >
                  {isSupported ? "✓" : "✕"}
                </span>
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
