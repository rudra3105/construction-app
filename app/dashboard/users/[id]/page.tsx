import { prisma } from '../../../../lib/prisma';
import { updateUser } from '../../../actions/userActions';
import { redirect } from 'next/navigation';
import { requireAdmin } from '../../../../lib/auth';

interface PageProps {
  params: { id: string };
}

export default async function UserEditPage({ params }: PageProps) {
  requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return redirect('/dashboard/users');

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Edit user</h1>
        <p className="mt-2 text-sm text-slate-400">Update supervisor or admin account details.</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <form action={updateUser} className="grid gap-4">
          <input type="hidden" name="id" value={user.id} />
          <label className="block text-sm text-slate-300">
            Name
            <input name="name" defaultValue={user.name} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm text-slate-300">
            Email
            <input name="email" type="email" defaultValue={user.email} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input name="password" type="password" placeholder="Leave blank to keep existing" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
          </label>
          <label className="block text-sm text-slate-300">
            Role
            <select name="role" defaultValue={user.role} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
              <option value="SUPERVISOR">Supervisor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Save user</button>
        </form>
      </div>
    </div>
  );
}
