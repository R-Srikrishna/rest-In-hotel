"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function GuestTable() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGuests = async () => {
    try {
      const response = await api.get("/guests");
      setGuests(response.data?.data?.guests || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const runLoad = async () => {
      try {
        const response = await api.get("/guests");
        if (active) {
          setGuests(response.data?.data?.guests || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void runLoad();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
      <table className="min-w-full text-sm text-slate-200">
        <thead className="bg-slate-800 text-left">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="px-4 py-6 text-slate-400" colSpan="4">Loading guests...</td></tr>
          ) : guests.length === 0 ? (
            <tr><td className="px-4 py-6 text-slate-400" colSpan="4">No guests found.</td></tr>
          ) : (
            guests.map((guest) => (
              <tr key={guest.id} className="border-t border-slate-800">
                <td className="px-4 py-3">{guest.firstName} {guest.lastName}</td>
                <td className="px-4 py-3">{guest.email}</td>
                <td className="px-4 py-3">{guest.phoneNumber}</td>
                <td className="px-4 py-3">Active</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
