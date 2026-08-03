import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
      <div className="max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Hotel management</p>
        <h1 className="mt-4 text-4xl font-semibold">Welcome to the hotel portal</h1>
        <p className="mt-4 text-lg text-slate-400">
          Sign in as a guest or admin with the same form, and create a guest account when needed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/login" className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500">
            Open sign-in form
          </Link>
          <Link href="/signup" className="rounded-full border border-slate-700 px-6 py-3 font-medium text-slate-200 transition hover:border-blue-500 hover:text-white">
            Create guest account
          </Link>
        </div>
      </div>
    </main>
  );
}
