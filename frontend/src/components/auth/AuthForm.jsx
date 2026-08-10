"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginGuest, loginAdmin, signupGuest } from "@/services/auth.service";

const guestInitialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
};

const loginInitialState = {
  email: "",
  password: "",
};

const getInitialFormData = (mode) => {
  if (mode === "signup") {
    return { ...guestInitialState };
  }

  return { ...loginInitialState };
};

export default function AuthForm({
  mode = "login",
  userType = "guest",
  showSlider = false,
}) {
  const router = useRouter();
  const { login } = useAuth();
  const [activeMode, setActiveMode] = useState(mode);
  const [formData, setFormData] = useState(() => getInitialFormData(mode));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showModeSwitch = showSlider && userType !== "admin";
  const currentMode = showModeSwitch ? activeMode : mode;
  const isLoginMode = currentMode === "login";
  const isSignupMode = currentMode === "signup";
  const isAdminPortal = userType === "admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const switchMode = (nextMode) => {
    setActiveMode(nextMode);
    setFormData(getInitialFormData(nextMode));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let response;

      if (isSignupMode) {
        response = await signupGuest(formData);
      } else if (userType === "admin") {
        response = await loginAdmin({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await loginGuest({
          email: formData.email,
          password: formData.password,
        });
      }

      const token = response?.token;
      const userData = response?.data?.guest || response?.data?.admin || null;
      const isAdminUser = Boolean(response?.data?.admin);

      if (!token) {
        throw new Error("Authentication failed");
      }

      login(token, userData);
      router.replace(isAdminUser ? "/admin" : "/");
    } catch (err) {
      const apiError =
        err?.response?.data?.message ||
        err?.message ||
        "Authentication failed. Please try again.";

      setError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
        <div className="px-6 py-8 sm:px-10 lg:px-12">
          <div className="mb-6 text-center">
            {/* <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {isSignupMode
                ? "Create your account"
                : isAdminPortal
                  ? "Sign in to admin"
                  : "Welcome back"}
            </h1> */}
            {/* <p className="mt-4 text-base text-blue-50/90">
              {isSignupMode
                ? "New guests can create an account here."
                : "Sign in as an admin or guest using the same form."}
            </p> */}
            <h1 className="text-2xl font-bold">Rest-Inn</h1>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {isSignupMode
                  ? "Sign up"
                  : isAdminPortal
                    ? "Admin sign in"
                    : "Sign in"}
              </h2>
              {/* <p className="mt-1 text-sm text-slate-400">
                {isSignupMode
                  ? "Create a guest account"
                  : "Sign in as guest or admin"}
              </p> */}
            </div>

            {showModeSwitch ? (
              <div className="inline-flex rounded-full bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    currentMode === "login"
                      ? "bg-white text-slate-900"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    currentMode === "signup"
                      ? "bg-white text-slate-900"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Sign up
                </button>
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-inner">
            <div className="w-full p-6 sm:p-8">
              {isLoginMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    required
                  />

                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    required
                  />

                  {error ? (
                    <p className="text-sm text-red-400">{error}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Please wait..." : "Sign in"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                      required
                    />
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                      required
                    />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                      required
                    />
                  </div>

                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    required
                  />

                  {error ? (
                    <p className="text-sm text-red-400">{error}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Please wait..." : "Create account"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {showModeSwitch ? (
            <div className="mt-4 text-sm text-slate-400">
              Use the tabs above to switch between sign in and sign up
              instantly.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
