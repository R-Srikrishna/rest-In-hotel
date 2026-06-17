"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateGuest } from "@/services/guest.service";
import {
  User,
  Mail,
  Phone,
  Globe,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const FIELDS = [
  {
    label: "First Name",
    name: "firstName",
    type: "text",
    icon: User,
    placeholder: "John",
  },
  {
    label: "Last Name",
    name: "lastName",
    type: "text",
    icon: User,
    placeholder: "Doe",
  },
  {
    label: "Email Address",
    name: "email",
    type: "email",
    icon: Mail,
    placeholder: "john@example.com",
  },
  {
    label: "Phone Number",
    name: "phoneNumber",
    type: "text",
    icon: Phone,
    placeholder: "+1 234 567 890",
  },
  {
    label: "Country",
    name: "country",
    type: "text",
    icon: Globe,
    placeholder: "United States",
  },
];

export default function GuestForm({ guest }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (guest) {
      setFormData({
        firstName: guest.firstName || "",
        lastName: guest.lastName || "",
        email: guest.email || "",
        phoneNumber: guest.phoneNumber || "",
        country: guest.country || "",
      });
    }
  }, [guest]);

  const handleChange = (e) => {
    setStatus(null);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!guest?.id) {
      setStatus("error");
      setMessage("Guest ID not found. Cannot update.");
      return;
    }

    try {
      setSubmitting(true);
      await updateGuest(guest.id, formData);
      setStatus("success");
      setMessage("Guest updated successfully!");
      setTimeout(() => {
        router.push("/guests");
        router.refresh();
      }, 800);
    } catch (err) {
      console.error("Update failed:", err);
      setStatus("error");
      setMessage("Failed to update guest. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Update Guest
            </h2>
            {guest && (
              <p className="text-xs text-gray-400 mt-0.5">
                Editing: {guest.firstName} {guest.lastName}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Status banner */}
          {status === "error" && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {message}
            </div>
          )}
          {status === "success" && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {message}
            </div>
          )}

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FIELDS.map(({ label, name, type, icon: Icon, placeholder }) => (
              <div
                key={name}
                className={name === "email" ? "sm:col-span-2" : ""}
              >
                <label
                  htmlFor={name}
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  {label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                    <Icon className="w-4 h-4" />
                  </span>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || status === "success"}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-sm shadow-blue-200"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Save Changes"
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
