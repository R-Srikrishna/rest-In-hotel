"use client";

import React from "react";
import GuestCard from "./GuestCard";
import {
  IdCard,
  Mail,
  Phone,
  Globe,
  MapPin,
  ShieldCheck,
  CalendarDays,
  UserCircle2,
  Loader2,
} from "lucide-react";

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  INACTIVE: "bg-red-50 text-red-600 border border-red-100",
  PENDING: "bg-amber-50 text-amber-700 border border-amber-100",
};

const DetailField = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/40 transition-colors">
    <span className="mt-0.5 text-blue-400">
      <Icon className="w-4 h-4" />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <div className="text-sm font-medium text-gray-900 break-words">
        {children}
      </div>
    </div>
  </div>
);

const GuestProfile = ({ guest }) => {
  if (!guest) {
    return (
      <div className="flex flex-col items-center justify-center h-52 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Loading guest profile…</p>
      </div>
    );
  }

  const initials =
    `${guest.firstName?.[0] ?? ""}${guest.lastName?.[0] ?? ""}`.toUpperCase();
  const statusKey = (guest.status || "PENDING").toUpperCase();
  const statusClass = STATUS_STYLES[statusKey] || STATUS_STYLES.PENDING;

  return (
    <div className="max-w-3xl mx-auto mt-20 space-y-5">
      {/* Hero card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md shadow-blue-200">
          {initials || <UserCircle2 className="w-8 h-8" />}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">
            {guest.firstName} {guest.lastName}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{guest.email}</p>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${statusClass}`}
        >
          {statusKey}
        </span>
      </div>

      {/* GuestCard summary (from your existing component) */}
      {GuestCard && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <GuestCard guest={guest} />
        </div>
      )}

      {/* Detailed info grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <IdCard className="w-4 h-4 text-blue-500" />
          Detailed Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DetailField icon={IdCard} label="Guest ID">
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
              #{guest.id}
            </span>
          </DetailField>

          <DetailField icon={Mail} label="Email Address">
            {guest.email}
          </DetailField>

          <DetailField icon={Phone} label="Phone Number">
            {guest.phoneNumber || (
              <span className="text-gray-300 italic">Not provided</span>
            )}
          </DetailField>

          <DetailField icon={Globe} label="Country">
            {guest.country || (
              <span className="text-gray-300 italic">Not provided</span>
            )}
          </DetailField>

          <DetailField icon={MapPin} label="Address">
            {guest.address || (
              <span className="text-gray-300 italic">No address provided</span>
            )}
          </DetailField>

          <DetailField icon={ShieldCheck} label="System Role">
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide border border-blue-100">
              {guest.role || "User"}
            </span>
          </DetailField>

          <DetailField icon={CalendarDays} label="Created">
            {guest.createdAt ? (
              new Date(guest.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            ) : (
              <span className="text-gray-300 italic">N/A</span>
            )}
          </DetailField>

          <DetailField icon={ShieldCheck} label="Account Status">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${statusClass}`}
            >
              {statusKey}
            </span>
          </DetailField>
        </div>
      </div>
    </div>
  );
};

export default GuestProfile;
