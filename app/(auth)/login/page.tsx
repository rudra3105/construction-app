import Link from 'next/link';
import { loginAction } from '../../actions/authActions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - SiteSutra'
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">SiteSutra</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in with your email and password.</p>

        <form action={loginAction} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>

          <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          No account?{' '}
          <Link href="/register" className="text-sky-300 hover:text-sky-200">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
