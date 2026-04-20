import Link from 'next/link';
import { registerAction } from '../../actions/authActions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - SiteSutra'
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Register a supervisor or admin account.</p>

        <form action={registerAction} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm text-slate-300">Full Name</span>
            <input name="name" type="text" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Role</span>
            <select name="role" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
              <option value="SUPERVISOR">Supervisor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>

          <button type="submit" className="w-full rounded-2xl bg-green-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-green-400">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-sky-300 hover:text-sky-200">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
