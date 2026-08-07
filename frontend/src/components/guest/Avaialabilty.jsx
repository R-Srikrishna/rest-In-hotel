"use client";

import { useState } from "react";
import RoomCard from "./RoomCard";
import { calculateNights } from "@/utils/dateUtils";

export default function AvailableRooms() {
  const [search, setSearch] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: "2 adults",
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sortOption, setSortOption] = useState("topPicks");

  const nights = calculateNights
    ? calculateNights(search.checkInDate, search.checkOutDate)
    : 0;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (nights <= 0) {
      return setMessage("Check-out date must be after check-in date.");
    }

    try {
      setLoading(true);
      setMessage("");

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(
        `${API_URL}/api/rooms?available=true&checkInDate=${search.checkInDate}&checkOutDate=${search.checkOutDate}`,
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load rooms");

      const fetchedRooms = data.data?.rooms || data.rooms || [];
      setRooms(fetchedRooms);
    } catch (err) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Search Bar */}
      <div className="bg-[#003580] py-6 px-4 shadow-md">
        <form
          onSubmit={handleSearch}
          className="max-w-6xl mx-auto bg-amber-400 p-1.5 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-1"
        >
          <div className="md:col-span-3 bg-white flex items-center px-3 py-2 rounded-md">
            <span className="mr-2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Where are you going?"
              className="w-full text-slate-800 focus:outline-none text-sm font-medium"
              defaultValue="City Center"
            />
          </div>

          <div className="md:col-span-3 bg-white flex items-center px-3 py-2 rounded-md">
            <span className="mr-2 text-slate-400">📅</span>
            <input
              type="date"
              value={search.checkInDate}
              onChange={(e) =>
                setSearch({ ...search, checkInDate: e.target.value })
              }
              required
              className="w-full text-slate-800 text-sm focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 bg-white flex items-center px-3 py-2 rounded-md">
            <span className="mr-2 text-slate-400">📅</span>
            <input
              type="date"
              value={search.checkOutDate}
              onChange={(e) =>
                setSearch({ ...search, checkOutDate: e.target.value })
              }
              required
              className="w-full text-slate-800 text-sm focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition text-sm flex items-center justify-center gap-2"
            >
              SEARCH
            </button>
          </div>
        </form>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">
              Star Rating
            </h3>
            <div className="space-y-2 text-sm text-slate-600">
              {[5, 4, 3, 2, 1].map((stars) => (
                <label
                  key={stars}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{stars} stars</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">
              Review Score
            </h3>
            <div className="space-y-2 text-sm text-slate-600">
              {["Exceptional 9+", "Very good 8+", "Good 7+", "Pleasant 6+"].map(
                (score, idx) => (
                  <label
                    key={idx}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{score}</span>
                  </label>
                ),
              )}
            </div>
          </div>
        </aside>

        {/* Results Column */}
        <main className="lg:col-span-3">
          {/* Sorting Tabs */}
          <div className="flex border-b border-slate-200 bg-white rounded-t-lg overflow-hidden shadow-sm mb-4 text-sm">
            {[
              { id: "topPicks", label: "Our top picks" },
              { id: "lowestPrice", label: "Lowest price first" },
              { id: "bestReviewed", label: "Best reviewed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSortOption(tab.id)}
                className={`flex-1 py-3 px-4 text-center font-medium transition ${
                  sortOption === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {message && (
            <div className="p-4 mb-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-slate-600 font-medium">
                Searching available rooms...
              </p>
            </div>
          ) : rooms.length > 0 ? (
            <div className="space-y-4">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} searchDates={search} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-lg border border-slate-200 text-slate-500">
              No rooms found for the selected criteria. Select check-in and
              check-out dates to view available accommodations.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
