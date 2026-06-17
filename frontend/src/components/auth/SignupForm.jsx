"use client";

import React, { useState } from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const SignupForm = () => {
  const [emailSent, setEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    country: "",
    nationality: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      type: "",
      message: "",
    });

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setEmailSent(true);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📧</div>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Verification Email Sent
        </h2>

        <p className="text-slate-600 mb-2">
          We've sent a verification email to:
        </p>

        <p className="font-semibold text-slate-900 break-all">
          {formData.email}
        </p>

        <p className="mt-6 text-slate-500">
          Please check your inbox and click the verification link.
        </p>

        <p className="mt-2 text-slate-500">
          After verification, you'll be able to login.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label>First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            type="text"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            type="text"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label>Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Password</label>
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            type="tel"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label>Country</label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            type="text"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Nationality</label>
          <input
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            type="text"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>
      </div>

      {status.message && (
        <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700">
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white"
      >
        {isSubmitting ? "Signing up..." : "Signup"}
      </button>
    </form>
  );
};

export default SignupForm;
