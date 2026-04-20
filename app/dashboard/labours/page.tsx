import { prisma } from '../../../lib/prisma';
import { createLabour, deleteLabour } from '../../actions/resourceActions';

export default async function LaboursPage() {
  const sites = await prisma.site.findMany();
  const labours = await prisma.labour.findMany({ include: { site: true } });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-semibold text-white">Labour management</h1>
        <p className="mt-2 text-sm text-slate-400">Add workers, roles, wages, and assign sites.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Add worker</h2>
          <form action={createLabour} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Name
              <input name="name" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Role
              <input name="role" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Daily wage
              <input name="dailyWage" type="number" step="0.1" required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Site assignment
              <select name="siteId" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400">
                <option value="">Unassigned</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400">Add worker</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Worker list</h2>
          <div className="mt-6 space-y-4">
            {labours.length ? (
              labours.map((labour) => (
                <div key={labour.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-white">{labour.name}</p>
                      <p className="text-sm text-slate-400">{labour.role} • {labour.site?.name ?? 'No site'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-slate-300">₹{labour.dailyWage.toFixed(2)} / day</p>
                      <form action={deleteLabour}>
                        <input type="hidden" name="id" value={labour.id} />
                        <button type="submit" className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-400">Delete</button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No workers added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
