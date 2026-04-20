import { prisma } from '../../../lib/prisma';
import { createUser, deleteUser } from '../../actions/userActions';
import Link from 'next/link';
import { requireAdmin } from '../../../lib/auth';

export default async function UsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">User management</h1>
        <p className="mt-2 text-sm text-slate-400">Admin can manage supervisors and accounts.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Add user</h2>
          <form action={createUser} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Name
              <input name="name" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Email
              <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Password
              <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Role
              <select name="role" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                <option value="SUPERVISOR">Supervisor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Create user</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Users</h2>
          <div className="mt-6 space-y-4">
            {users.length ? (
              users.map((user) => (
                <div key={user.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                      <p className="text-sm text-slate-300">Role: {user.role}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/dashboard/users/${user.id}`} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">Edit</Link>
                      <form action={deleteUser}>
                        <input type="hidden" name="id" value={user.id} />
                        <button type="submit" className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400">Delete</button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No users found yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
