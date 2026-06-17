"use client";

import { useEffect, useState, use } from "react";
import { fetchGuestById } from "../../../../../services/guest.service";
import Link from "next/link";
import GuestForm from "../../../../../components/guest/GuestForm";

export default function GuestEditPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getSingleGuest() {
      try {
        setLoading(true);
        const data = await fetchGuestById(params.id);
        const cleanData = data?.guest ? data.guest : data;
        setGuest(cleanData);
      } catch (err) {
        console.error("Failed to read guest for editing:", err);
        setError("Could not load guest form data.");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      getSingleGuest();
    }
  }, [params.id]);

  // Add this visual spinner check before your main return statement
  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        {/* Animated Circular Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <main className="flex-grow min-w-0 p-4 md:p-6 pl-16 md:pl-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Edit Guest Details
            </h1>
            <p className="text-xs text-gray-400">
              Updating Profile ID: #{params.id}
            </p>
          </div>
          <Link
            href="/guests"
            className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>

        {/* Form Container Wrapper */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <GuestForm guest={guest} />
        </div>
      </div>
    </main>
  );
}
