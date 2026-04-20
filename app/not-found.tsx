import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
      <div className="max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-10">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-4 text-slate-400">The page you are looking for does not exist.</p>
        <Link href="/dashboard" className="mt-6 inline-block rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
