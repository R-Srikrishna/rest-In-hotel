"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { fetchGuestById } from "@/services/guest.service";
import GuestCard from "@/components/guest/GuestCard"; // Importing your new visual card

export default function GuestViewPage({ params: paramsPromise }) {
  // Safe Next.js 16 async param unwrapping
  const params = use(paramsPromise);

  const [guest, setGuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGuest() {
      try {
        if (!params?.id) return;
        const data = await fetchGuestById(params.id);
        setGuest(data?.guest || data);
      } catch (error) {
        console.error("Error loading guest:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadGuest();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading guest profile...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Navigation Row */}
      <div className="max-w-xl mx-auto">
        <Link
          href="/guests"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition mt-10 gap-1"
        >
          ← Back to Guest List
        </Link>
      </div>

      {/* Render beautiful card view */}
      <GuestCard guest={guest} />
    </div>
  );
}
