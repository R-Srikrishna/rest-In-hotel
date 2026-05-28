import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <div className="max-w-2xl rounded-3xl bg-white p-10 shadow-xl border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-900">Welcome to Hotel Manager</h1>
          <p className="mt-4 text-slate-600">Choose an action below to sign in or create a new account.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="rounded-xl bg-slate-900 px-6 py-3 text-white text-sm font-semibold transition hover:bg-slate-800"
            >
              Go to Login
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-900 text-sm font-semibold transition hover:bg-slate-slate-50"
            >
              Go to Signup
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
