"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchGuests, deleteGuest } from "../../../services/guest.service"; // Adjust this import path to your service file
import GuestTable from "../../../components/guest/GuestTable"; // Adjust path

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchGuests();
        // Fallback to array if data is undefined or nested differently
        setGuests(data || []);
      } catch (error) {
        console.error("UI Page fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdate = (id) => {
    router.push(`/guests/${id}/edit`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteGuest(id);
      // Cleanly filter out the item from state to update the UI instantly
      setGuests((prev) => prev.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error("UI Page delete error:", error);
    }
  };

  // Add this visual spinner check before your main return statement
  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        {/* Animated Circular Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="flex-grow min-w-0 p-4 md:p-6 pl-16 md:pl-6 overflow-y-auto">
      <GuestTable
        guests={guests}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />
    </main>
  );
}
