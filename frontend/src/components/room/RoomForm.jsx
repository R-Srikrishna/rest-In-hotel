"use client";

import React, { useState, useEffect } from "react";

export default function RoomForm({ onSubmit, onCancel, initialData }) {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Deluxe");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");

  const [amenities, setAmenities] = useState({
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
  });

  useEffect(() => {
    if (initialData) {
      setRoomNumber(initialData.roomNumber || "");
      setRoomType(initialData.roomType || "Deluxe");
      setPrice(initialData.price || "");
      setStatus(initialData.available ? "Available" : "Occupied");
      setAmenities({
        tv: !!initialData.tv,
        fridge: !!initialData.fridge,
        washingMachine: !!initialData.washingMachine,
        heater: !!initialData.heater,
        bathtub: !!initialData.bathtub,
        internetAccess: !!initialData.internetAccess,
        coffeeTea: !!initialData.coffeeTea,
        privatePool: !!initialData.privatePool,
        airConditioning: !!initialData.airConditioning,
        fan: !!initialData.fan,
        sofa: !!initialData.sofa,
        chairs: !!initialData.chairs,
        bed: initialData.bed ?? true,
      });
    }
  }, [initialData]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAmenities((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomNumber || !price)
      return alert("Please fill in Room Number and Price");

    const roomPayload = {
      roomNumber: parseInt(roomNumber, 10),
      roomType: roomType,
      price: parseFloat(price),
      available: status === "Available",
      status: status,
      ...amenities,
    };
    onSubmit(roomPayload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 p-6 rounded-2xl max-w-xl mx-auto space-y-5 text-left"
    >
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
        {initialData ? "Update Room Settings" : "New Room Profile"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Room Number:
          </label>
          <input
            type="number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
            className="w-full border p-2 text-sm rounded-lg bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Room Type:
          </label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full border p-2 text-sm rounded-lg bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Deluxe">Deluxe</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Price per Night ($):
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border p-2 text-sm rounded-lg bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Status:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 text-sm rounded-lg bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied / Maintenance</option>
          </select>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">
          Included Amenities
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {Object.keys(amenities).map((feature) => (
            <label
              key={feature}
              className="flex items-center gap-2 p-2.5 rounded-lg border bg-gray-50 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition"
            >
              <input
                type="checkbox"
                name={feature}
                checked={amenities[feature]}
                onChange={handleCheckboxChange}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="capitalize">
                {feature.replace(/([A-Z])/g, " $1")}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
